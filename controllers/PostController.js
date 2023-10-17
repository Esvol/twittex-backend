import PostModel from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      comments: [],
      tags: req.body.tags,
      imageUrl: req.body.imageUrl ?? "",
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(402).json("Не удалось создать пост.");
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
          path: 'user',
          model: 'User',
      }
    })
    .exec();

    if (!post) {
      throw new Error("Не нашло нужного поста.");
    }

    res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(402).json("Не удалось найти пост.");
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    if (!posts) {
      throw new Error("Не нашло ни одного поста.");
    }

    res.send(posts);
  } catch (error) {
    console.log(error);
    return res.status(401).json("There are no posts here");
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    if (!posts) {
      throw new Error("Не нашло ни одного поста.");
    }

    const tags = posts.map((obj) => obj.tags).flat();
    const uniqueTags = tags.reduce((acc, tag) => {
      if (acc.includes(tag)) {
        return acc;
      }
      return [...acc, tag];
    }, []);

    res.send(uniqueTags);
  } catch (error) {
    console.log(error);
    return res.status(401).json("There are no tags here");
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      throw new Erorr("Нет передачи айди в пути ссылки.");
    }

    const deletedPost = await PostModel.findOneAndDelete({
      _id: postId,
    });

    if (!deletedPost) {
      throw new Erorr("Поста нет в бд, чтобы удалить.");
    }

    res.json(deletedPost);
  } catch (error) {
    console.log(error);
    return res.status(402).json("Не удалось удалить пост.");
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      throw new Erorr("Нет передачи айди в пути ссылки.");
    }

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      },
      { new: true }
    );

    if (!updatedPost) {
      throw new Error("Не удалось найти и изменить пост.");
    }

    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(404).json("There is no post here to update.");
  }
};
