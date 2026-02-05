//HTTP request Get,post,put,delete
// ========== POSTS FUNCTIONS ==========
async function Load() {
    try {
        let res = await fetch('http://localhost:3000/posts')
        let data = await res.json();
        let body = document.getElementById("table-body");
        body.innerHTML = "";
        for (const post of data) {
            // Hiển thị posts xoá mềm với gạch ngang
            const isDeleted = post.isDeleted === true;
            const rowStyle = isDeleted ? 'style="text-decoration: line-through; opacity: 0.6;"' : '';
            const deleteBtn = isDeleted 
                ? `<input value="Restore" type="submit" onclick="Restore(${post.id})" />`
                : `<input value="Delete" type="submit" onclick="Delete(${post.id})" />`;
            
            body.innerHTML += `
            <tr ${rowStyle}>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${deleteBtn}</td>
                <td><input value="View Comments" type="submit" onclick="LoadComments('${post.id}')" /></td>
            </tr>`
        }
    } catch (error) {
        console.error("Load error:", error);
    }
}

async function Save() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;
    let res;
    
    if (id === "") {
        // Tạo ID tự động: maxId + 1
        let allPosts = await fetch('http://localhost:3000/posts');
        let posts = await allPosts.json();
        let maxId = 0;
        for (const post of posts) {
            let postId = parseInt(post.id);
            if (postId > maxId) {
                maxId = postId;
            }
        }
        id = String(maxId + 1);
    }
    
    let getID = await fetch('http://localhost:3000/posts/' + id);
    if (getID.ok) {
        // Update existing post
        let existingPost = await getID.json();
        res = await fetch('http://localhost:3000/posts/'+id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    id: id,
                    title: title,
                    views: views,
                    isDeleted: existingPost.isDeleted || false
                }
            )
        })
    } else {
        // Create new post
        res = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    id: id,
                    title: title,
                    views: views,
                    isDeleted: false
                }
            )
        })
    }
    if (res.ok) {
        console.log("Luu thanh cong");
        document.getElementById("id_txt").value = "";
        document.getElementById("title_txt").value = "";
        document.getElementById("views_txt").value = "";
        Load();
    }
}

// Xoá mềm: thêm isDeleted: true
async function Delete(id) {
    let getPost = await fetch('http://localhost:3000/posts/' + id);
    if (getPost.ok) {
        let post = await getPost.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: true
            })
        });
        if (res.ok) {
            console.log("Xoa mem thanh cong");
            Load();
        }
    }
}

// Khôi phục post đã xoá mềm
async function Restore(id) {
    let getPost = await fetch('http://localhost:3000/posts/' + id);
    if (getPost.ok) {
        let post = await getPost.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: false
            })
        });
        if (res.ok) {
            console.log("Khoi phuc thanh cong");
            Load();
        }
    }
}

// ========== COMMENTS FUNCTIONS ==========
async function LoadComments(postId) {
    try {
        document.getElementById("current-post-id").value = postId;
        document.getElementById("comments-section").style.display = "block";
        
        let res = await fetch(`http://localhost:3000/comments?postId=${postId}`);
        let data = await res.json();
        let body = document.getElementById("comments-body");
        body.innerHTML = "";
        
        for (const comment of data) {
            const isDeleted = comment.isDeleted === true;
            const rowStyle = isDeleted ? 'style="text-decoration: line-through; opacity: 0.6;"' : '';
            const deleteBtn = isDeleted 
                ? `<input value="Restore" type="submit" onclick="RestoreComment(${comment.id})" />`
                : `<input value="Delete" type="submit" onclick="DeleteComment(${comment.id})" />`;
            
            body.innerHTML += `
            <tr ${rowStyle}>
                <td>${comment.id}</td>
                <td>${comment.text}</td>
                <td>
                    <input value="Edit" type="submit" onclick="EditComment('${comment.id}', '${comment.text.replace(/'/g, "\\'")}', '${comment.postId}')" />
                    ${deleteBtn}
                </td>
            </tr>`
        }
    } catch (error) {
        console.error("LoadComments error:", error);
    }
}

async function SaveComment() {
    let commentId = document.getElementById("comment_id_txt").value.trim();
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("current-post-id").value;
    let res;
    
    if (commentId === "") {
        // Tạo ID tự động: maxId + 1
        let allComments = await fetch('http://localhost:3000/comments');
        let comments = await allComments.json();
        let maxId = 0;
        for (const comment of comments) {
            let cId = parseInt(comment.id);
            if (cId > maxId) {
                maxId = cId;
            }
        }
        commentId = String(maxId + 1);
    }
    
    let getID = await fetch('http://localhost:3000/comments/' + commentId);
    if (getID.ok) {
        // Update existing comment
        let existingComment = await getID.json();
        res = await fetch('http://localhost:3000/comments/' + commentId, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: commentId,
                text: text,
                postId: postId,
                isDeleted: existingComment.isDeleted || false
            })
        })
    } else {
        // Create new comment
        res = await fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: commentId,
                text: text,
                postId: postId,
                isDeleted: false
            })
        })
    }
    
    if (res.ok) {
        console.log("Luu comment thanh cong");
        document.getElementById("comment_id_txt").value = "";
        document.getElementById("comment_text_txt").value = "";
        LoadComments(postId);
    }
}

function EditComment(id, text, postId) {
    document.getElementById("comment_id_txt").value = id;
    document.getElementById("comment_text_txt").value = text;
}

async function DeleteComment(id) {
    let getComment = await fetch('http://localhost:3000/comments/' + id);
    if (getComment.ok) {
        let comment = await getComment.json();
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...comment,
                isDeleted: true
            })
        });
        if (res.ok) {
            console.log("Xoa mem comment thanh cong");
            LoadComments(comment.postId);
        }
    }
}

async function RestoreComment(id) {
    let getComment = await fetch('http://localhost:3000/comments/' + id);
    if (getComment.ok) {
        let comment = await getComment.json();
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...comment,
                isDeleted: false
            })
        });
        if (res.ok) {
            console.log("Khoi phuc comment thanh cong");
            LoadComments(comment.postId);
        }
    }
}

function HideComments() {
    document.getElementById("comments-section").style.display = "none";
    document.getElementById("comment_id_txt").value = "";
    document.getElementById("comment_text_txt").value = "";
}

Load();