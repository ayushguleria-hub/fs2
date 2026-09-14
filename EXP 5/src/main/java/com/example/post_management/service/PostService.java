package com.example.post_management.service;

import com.example.post_management.exception.PostNotFoundException;
import com.example.post_management.dto.PostRequest;
import com.example.post_management.entity.Post;
import com.example.post_management.repository.PostRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private static final Logger logger =
            LoggerFactory.getLogger(PostService.class);

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // CREATE
    public Post createPost(PostRequest request) {

        logger.info("Creating a new post with title: {}", request.getTitle());

        Post post = new Post();

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());

        Post savedPost = postRepository.save(post);

        logger.info("Post created successfully with id: {}", savedPost.getId());

        return savedPost;
    }

    // READ ALL
    public List<Post> getAllPosts() {

        logger.info("Fetching all posts");

        return postRepository.findAll();
    }

    // READ ONE
    public Post getPostById(Long id) {

        logger.info("Fetching post with id: {}", id);

        return postRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Post not found with id: {}", id);

                    return new PostNotFoundException(
                            "Post not found with id: " + id
                    );
                });
    }

    // UPDATE
    public Optional<Post> updatePost(
            Long id,
            PostRequest request) {

        logger.info("Updating post with id: {}", id);

        Optional<Post> optionalPost =
                postRepository.findById(id);

        if (optionalPost.isPresent()) {

            Post post = optionalPost.get();

            post.setTitle(request.getTitle());
            post.setContent(request.getContent());

            Post updatedPost = postRepository.save(post);

            logger.info("Post updated successfully with id: {}", id);

            return Optional.of(updatedPost);
        }

        logger.warn("Cannot update. Post not found with id: {}", id);

        return Optional.empty();
    }

    // DELETE
    public boolean deletePost(Long id) {

        logger.info("Deleting post with id: {}", id);

        if (postRepository.existsById(id)) {

            postRepository.deleteById(id);

            logger.info("Post deleted successfully with id: {}", id);

            return true;
        }

        logger.warn("Cannot delete. Post not found with id: {}", id);

        return false;
    }
}