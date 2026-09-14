const API_URL = "http://localhost:8080/api/posts";

let editingPostId = null;


// ========================================
// Load All Posts
// ========================================

async function loadPosts() {

    const postsContainer =
        document.getElementById("posts-container");

    postsContainer.innerHTML =
        '<p class="loading">Loading posts...</p>';

    try {

        const response = await fetch(API_URL);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to load posts");
        }

        displayPosts(result.data);

    } catch (error) {

        console.error("Error loading posts:", error);

        postsContainer.innerHTML =
            `<p class="empty">${error.message}</p>`;
    }
}


// ========================================
// Display Posts
// ========================================

function displayPosts(posts) {

    const postsContainer =
        document.getElementById("posts-container");

    if (!posts || posts.length === 0) {

        postsContainer.innerHTML =
            '<p class="empty">No posts available.</p>';

        return;
    }

    postsContainer.innerHTML = posts.map(post => {

        return `
            <div class="post-card">

                <div class="post-id">
                    Post ID: ${post.id}
                </div>

                <h3>${escapeHtml(post.title)}</h3>

                <p>${escapeHtml(post.content)}</p>

                <div class="post-actions">

                    <button
                        class="btn edit-btn"
                        onclick="editPost(${post.id})">
                        Edit
                    </button>

                    <button
                        class="btn delete-btn"
                        onclick="deletePost(${post.id})">
                        Delete
                    </button>

                </div>

            </div>
        `;

    }).join("");
}


// ========================================
// Create / Update Post
// ========================================

document
    .getElementById("post-form")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const title =
            document.getElementById("title").value.trim();

        const content =
            document.getElementById("content").value.trim();

        const postData = {
            title: title,
            content: content
        };

        try {

            let response;

            if (editingPostId === null) {

                // CREATE
                response = await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(postData)
                });

            } else {

                // UPDATE
                response = await fetch(
                    `${API_URL}/${editingPostId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(postData)
                    }
                );
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Operation failed"
                );
            }

            if (editingPostId === null) {

                showMessage(
                    "Post created successfully!",
                    "success"
                );

            } else {

                showMessage(
                    "Post updated successfully!",
                    "success"
                );
            }

            resetForm();

            await loadPosts();

        } catch (error) {

            console.error("Error saving post:", error);

            showMessage(
                error.message,
                "error"
            );
        }
    });


// ========================================
// Edit Post
// ========================================

async function editPost(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to get post"
            );
        }

        const post = result.data;

        document.getElementById("title").value =
            post.title;

        document.getElementById("content").value =
            post.content;

        editingPostId = id;

        document.getElementById("form-title").textContent =
            "Update Post";

        document.getElementById("submit-btn").textContent =
            "Update Post";

        document.getElementById("cancel-btn").style.display =
            "inline-block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error("Error editing post:", error);

        showMessage(
            error.message,
            "error"
        );
    }
}


// ========================================
// Delete Post
// ========================================

async function deletePost(id) {

    const confirmed =
        confirm("Are you sure you want to delete this post?");

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to delete post"
            );
        }

        showMessage(
            "Post deleted successfully!",
            "success"
        );

        await loadPosts();

    } catch (error) {

        console.error("Error deleting post:", error);

        showMessage(
            error.message,
            "error"
        );
    }
}


// ========================================
// Cancel Edit
// ========================================

function cancelEdit() {

    resetForm();

    showMessage(
        "Edit cancelled",
        "success"
    );
}


// ========================================
// Reset Form
// ========================================

function resetForm() {

    document.getElementById("post-form").reset();

    editingPostId = null;

    document.getElementById("form-title").textContent =
        "Create New Post";

    document.getElementById("submit-btn").textContent =
        "Create Post";

    document.getElementById("cancel-btn").style.display =
        "none";
}


// ========================================
// Show Message
// ========================================

function showMessage(message, type) {

    const messageElement =
        document.getElementById("message");

    messageElement.textContent = message;

    messageElement.className =
        `message ${type}`;

    setTimeout(() => {

        messageElement.className =
            "message";

        messageElement.textContent =
            "";

    }, 3000);
}


// ========================================
// HTML Escape
// ========================================

function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ========================================
// Load Posts When Page Opens
// ========================================

loadPosts();