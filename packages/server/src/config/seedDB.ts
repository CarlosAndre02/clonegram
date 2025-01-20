import { createPost } from "@/modules/post/PostService";
import { UserModel } from "@/modules/user/UserModel";
import { addPostToUser, getUserByUsername } from "@/modules/user/UserService";

export const seedDB = async () => {
    const hasRonaldo = await getUserByUsername("ronaldo")
    if (hasRonaldo) return

    const hasNeymar = await getUserByUsername("neymar")
    if (hasNeymar) return

    const hasMessi = await getUserByUsername("messi")
    if (hasMessi) return

    const ronaldo = await new UserModel({
        email: "ronaldo.original@gmail.com",
        fullname: "Cristiano Ronaldo",
        username: "ronaldo",
        password: "123456789",
        avatar: {
            key: "avatar/ronaldo-avatar",
            url: "https://clonegram-bucket.s3.us-east-1.amazonaws.com/avatar/ronaldo-avatar.jpg"
        }
    }).save();

    const neymar = await new UserModel({
        email: "neymar.original@gmail.com",
        fullname: "Neymar Jr",
        username: "neymar",
        password: "123456789",
        avatar: {
            key: "avatar/neymar-avatar",
            url: "https://clonegram-bucket.s3.us-east-1.amazonaws.com/avatar/neymar-avatar.webp"
        }
    }).save();

    const messi = await new UserModel({
        email: "messi.original@gmail.com",
        fullname: "Messi",
        username: "messi",
        password: "123456789",
        avatar: {
            key: "avatar/messi-avatar",
            url: "https://clonegram-bucket.s3.us-east-1.amazonaws.com/avatar/messi-avatar.webp"
        }
    }).save();

    const post1 = await createPost({
        description: "+3 pontos.",
        user: ronaldo.id,
        image: {
            key: "post/ronaldo-post",
            url: "https://clonegram-bucket.s3.us-east-1.amazonaws.com/post/ronaldo-post.jpg"
        }
    });
    await addPostToUser(ronaldo.id, post1.id);

    const post2 = await createPost({
        description: "Foco, força e fé 🙏",
        user: neymar.id,
        image: {
            key: "neymar-post1",
            url: "https://clonegram-bucket.s3.us-east-1.amazonaws.com/post/neymar-post1.jpg"
        }
    });
    await addPostToUser(neymar.id, post2.id);

    const post3 = await createPost({
        description: "Seguimos firme e forte 💪🏾",
        user: neymar.id,
        image: {
            key: "neymar-post2",
            url: "https://clonegram-bucket.s3.us-east-1.amazonaws.com/post/neymar-post2.jpg"
        }
    });
    await addPostToUser(neymar.id, post3.id);
    
    const post4 = await createPost({
        description: "Buen triunfo em nuestro regresso a la MLS",
        user: messi.id,
        image: {
            key: "messi-post",
            url: "https://clonegram-bucket.s3.us-east-1.amazonaws.com/post/messi-post.jpg"
        }
    });
    await addPostToUser(messi.id, post4.id);
};
