package com.cloudstore.controller;

import com.cloudstore.dto.FileResponse;
import com.cloudstore.dto.RegisterCloudFileRequest;
import com.cloudstore.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    // List all files
    @GetMapping("")
    public ResponseEntity<List<FileResponse>> listFiles(@RequestParam(required = false) Long folderId) {
        return ResponseEntity.ok(fileService.listFiles(Optional.ofNullable(folderId)));
    }

    // Upload multiple files
    @PostMapping("/upload")
    public ResponseEntity<List<FileResponse>> uploadFiles(@RequestParam("files") MultipartFile[] files,
                                                         @RequestParam(value = "folderId", required = false) Long folderId) throws java.io.IOException {
        return ResponseEntity.ok(fileService.uploadFiles(files, Optional.ofNullable(folderId)));
    }

    // Soft-delete a file
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        fileService.deleteFile(id);
        return ResponseEntity.ok().build();
    }

    // Rename a file
    @PostMapping("/rename/{id}")
    public ResponseEntity<FileResponse> renameFile(@PathVariable Long id, @RequestBody com.cloudstore.dto.RenameFileRequest request) {
        return ResponseEntity.ok(fileService.renameFile(id, request));
    }

    // Toggle favorite
    @PostMapping("/favorite/{id}")
    public ResponseEntity<FileResponse> favoriteFile(@PathVariable Long id) {
        return ResponseEntity.ok(fileService.toggleFavourite(id));
    }

    // Download a file
    @GetMapping("/{id}/download")
    public org.springframework.http.ResponseEntity<byte[]> downloadFile(@PathVariable Long id) throws java.io.IOException {
        byte[] data = fileService.downloadFile(id);
        return org.springframework.http.ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"file_" + id + "\"")
                .body(data);
    }

    // List deleted files
    @GetMapping("/deleted")
    public ResponseEntity<List<FileResponse>> listDeletedFiles(@RequestParam(required = false) Long folderId) {
        return ResponseEntity.ok(fileService.listDeletedFiles(Optional.ofNullable(folderId)));
    }

    // Restore a deleted file
    @PostMapping("/restore/{id}")
    public ResponseEntity<Void> restoreFile(@PathVariable Long id) {
        fileService.restoreFile(id);
        return ResponseEntity.ok().build();
    }

    // Permanently delete a file
    @DeleteMapping("/permanent/{id}")
    public ResponseEntity<Void> permanentlyDeleteFile(@PathVariable Long id) {
        fileService.permanentlyDeleteFile(id);
        return ResponseEntity.ok().build();
    }

    // Search files by name
    @GetMapping("/search")
    public ResponseEntity<List<FileResponse>> searchFiles(@RequestParam("query") String query) {
        return ResponseEntity.ok(fileService.searchFilesByName(query));
    }

    // Register a cloud file
    @PostMapping("/register")
    public ResponseEntity<FileResponse> registerCloudFile(@RequestBody RegisterCloudFileRequest request) {
        FileResponse response = fileService.registerCloudFile(
            request.getName(),
            request.getUrl(),
            request.getSize(),
            request.getType(),
            request.getFolderId()
        );
        return ResponseEntity.ok(response);
    }
} 