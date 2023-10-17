import PostModel from "../models/Post.js";
import CommentModel from "../models/Comment.js";

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return res.status(404).json({
        success: "false, post is not found.",
      });
    }

    const newComment = new CommentModel({
      text: req.body.text,
      user: req.userId,
      postId,
    });

    await newComment.save().then(savedComment => {
        PostModel.findByIdAndUpdate(postId, {$push: {comments: savedComment._id}}, {new: true})
                .then(async () => res.send(await CommentModel.findById(savedComment._id).populate("user").exec()))
                .catch(err => {
                    console.log(err);
                    res.status(404).json({
                        success: "failed, comment is not added.",
                    })
                }) 
        }
    );
    
  } catch (error) {
    console.log(error);
    return res.status(404).json("Не удалось добавить комментарий к посту.");
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate("user").exec();

    if (!comments){
      throw new Error('Комментариев не найдено');
    }

    res.send(comments);
  } catch (error) {
    console.log(error);
    return res.status(402).json("Не удалось найти комментариев.");
  }
}

export const removeComment = async (req, res) => {
  try {
    const comment = await CommentModel.findByIdAndDelete(req.body.id);
    const post = await PostModel.findOneAndUpdate({_id: req.body.postId}, {$pull: {comments: req.body.id}}, {new: true})

    if(!comment){
      throw new Error('Комментарий не был удален, так как не был найден.')
    }

    if (!post){
      throw new Error('Пост не был изменен, так как комментарий в нем не был найден.')
    }

    res.send(comment);
  } catch (error) {
    console.log(error);
    return res.status(404).json("Не удалось найти комментарий или его айди в посте, чтобы удалить.");
  }
}
