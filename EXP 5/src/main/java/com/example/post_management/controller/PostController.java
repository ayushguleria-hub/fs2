package com.example.post_management.controller;

import com.example.post_management.dto.PostRequest;
import com.example.post_management.entity.Post;
import com.example.post_management.exception.PostNotFoundException;
import com.example.post_management.response.ApiResponse;
import com.example.post_management.service.PostService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private static final Logger logger =
            LoggerFactory.getLogger(PostController.class);

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<ApiResponse<Post>> createPost(
            @Valid @RequestBody PostRequest request) {

        logger.info("POST /api/posts - Creating a new post");

        Post savedPost = postService.createPost(request);

        ApiResponse<Post> response =
                new ApiResponse<>(
                        true,
                        "Post created successfully",
                        savedPost
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<ApiResponse<List<Post>>> getAllPosts() {

        logger.info("GET /api/posts - Fetching all posts");

        List<Post> posts = postService.getAllPosts();

        ApiResponse<List<Post>> response =
                new ApiResponse<>(
                        true,
                        "Posts retrieved successfully",
                        posts
                );

        return ResponseEntity.ok(response);
    }

        // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> getPostById(
            @PathVariable Long id) {

        logger.info("GET /api/posts/{} - Fetching post", id);

        Post post = postService.getPostById(id);

        ApiResponse<Post> response =
                new ApiResponse<>(
                        true,
                        "Post retrieved successfully",
                        post
                );

        return ResponseEntity.ok(response);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request) {

        logger.info("PUT /api/posts/{} - Updating post", id);

        Post updatedPost = postService.updatePost(id, request)
                .orElseThrow(() ->
                        new PostNotFoundException(
                                "Post not found with id: " + id
                        )
                );

        ApiResponse<Post> response =
                new ApiResponse<>(
                        true,
                        "Post updated successfully",
                        updatedPost
                );

        return ResponseEntity.ok(response);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable Long id) {

        logger.info("DELETE /api/posts/{} - Deleting post", id);

        if (!postService.deletePost(id)) {
            throw new PostNotFoundException(
                    "Post not found with id: " + id
            );
        }

        ApiResponse<Void> response =
                new ApiResponse<>(
                        true,
                        "Post deleted successfully",
                        null
                );

        return ResponseEntity.ok(response);
    }
}