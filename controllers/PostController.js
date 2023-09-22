import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);
        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to find tags",
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("user").exec();

        res.json(posts)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to find posts",
        });
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const one = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {viewsCount: 1},
            },
            {
                returnDocument: 'after',
            },
        ).populate('user');
        return res.json(one);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve article',
        });
    }
};
export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const remove = await PostModel.findOneAndDelete(
            {
                _id: postId,
            },
        )
        return res.json(remove);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve articles',
        });
    }
};
export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to create a post",
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const update = await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags.split(','),
            }
        )
        return res.json(update);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update articles',
        });
    }
}