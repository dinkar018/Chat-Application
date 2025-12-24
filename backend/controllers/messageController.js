import  {redis}  from "../config/redis.js";
import {Conversation} from "../models/conversationModel.js";
import {Message} from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);

    await Promise.all([
      conversation.save(),
      newMessage.save(),
    ]);

    // 🔴 Publish only — no socket emit here
    await redis.publish(
      "chat_messages",
      JSON.stringify({
        receiverId,
        message: newMessage,
      })
    );

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
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate({
      path: "messages",
      populate: {
        path: "senderId receiverId",
        select: "username profilePhoto",
      },
    });

    return res.status(200).json(conversation?.messages || []);
  } catch (error) {
    console.error("Get Message Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

