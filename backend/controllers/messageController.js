import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;  // coming from isAuthenticated middleware
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        // find or create conversation
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // create new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        // push message to conversation
        gotConversation.messages.push(newMessage._id);

        await Promise.all([gotConversation.save(), newMessage.save()]);

        // SOCKET.IO real-time event
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({
            success: true,
            newMessage,
        });
    } catch (error) {
        console.error("Send Message Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate({
      path: "messages",
      populate: {
        path: "senderId receiverId", // populate both sender and receiver
        select: "username profilePhoto", // only get what you need
      },
    });

    return res.status(200).json(conversation?.messages || []);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
