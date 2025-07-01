package com.cloudstore.controller;

import com.cloudstore.dto.CreateFolderRequest;
import com.cloudstore.dto.FolderResponse;
import com.cloudstore.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;

    @GetMapping
    public ResponseEntity<List<FolderResponse>> listFolders(@RequestParam(required = false) Long parentId) {
        return ResponseEntity.ok(folderService.listFolders(Optional.ofNullable(parentId)));
    }

    @PostMapping
    public ResponseEntity<FolderResponse> createFolder(@RequestBody CreateFolderRequest request) {
        return ResponseEntity.ok(folderService.createFolder(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FolderResponse> renameFolder(@PathVariable Long id, @RequestBody com.cloudstore.dto.CreateFolderRequest request) {
        // For simplicity, reuse CreateFolderRequest for renaming (just use name field)
        return ResponseEntity.ok(folderService.renameFolder(id, request.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long id) {
        folderService.deleteFolder(id);
        return ResponseEntity.ok().build();
    }
} 