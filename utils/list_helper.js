const blog = require("../models/blog");

function dummy(blogs) {
    return 1;
};

function likes(array) {
    function sum(acc, item) {
        return acc + Number(item.likes);
    }
    return array.lenght === 0
        ? 0
        : array.reduce(sum, 0);
}

function favoriteBlog(array) {
    function favor() {
        let max = 0;
        array.forEach(blog => {
            if (blog.likes > max) max = blog.likes;
        });
        let ans = array.filter(blog => blog.likes == max);
        return ans[0];
    }
    return array.lenght === 0
        ? 0
        : favor();
}

function mostblogs(blogArray) {
    function findBlog() {
        const authors = blogArray.map(blog => blog.author);
        let most = 0;
        let object = {};
        let mapAuthors = authors.reduce((prev, cur) => {
            prev[cur] = (prev[cur] || 0) + 1;
            return prev;
        }, {});
        let maxes = [];
        for (key in mapAuthors) {
            maxes.push(mapAuthors[key]);
        };
        most = Math.max(...maxes);
        for (key in mapAuthors) {
            if (mapAuthors[key] === most) {
                object = {
                    author: key,
                    blogs: most
                };
            };
        };
        return object;
    }
    return blogArray.lenght === 0 ? 0 : findBlog();
}

function mostLikes(blogArray){
    function findLikesSum(){
        let max = 0;
        let maxBlog = blogArray.filter(blog =>{
            if(blog.likes > max){
                max = blog.likes;
                return blog;
            };
        });
        let mostauthors = blogArray.filter(blog => blog.author === maxBlog[maxBlog.length - 1].author);
        let sum = mostauthors.reduce((acc,item) =>{
            return acc + item.likes;
        },0);
        let object = {
            author: maxBlog[maxBlog.length - 1].author,
            likes: sum
        };
        console.log(object);
        return object;
    };
    return blogArray.lenght === 0 ? 0 : findLikesSum();
}

module.exports = { dummy, likes, favoriteBlog, mostblogs, mostLikes };