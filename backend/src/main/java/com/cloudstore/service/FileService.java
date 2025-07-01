package com.cloudstore.service;

import com.cloudstore.dto.FileResponse;
import com.cloudstore.dto.RenameFileRequest;
import com.cloudstore.model.File;
import com.cloudstore.model.Folder;
import com.cloudstore.model.User;
import com.cloudstore.repository.FileRepository;
import com.cloudstore.repository.FolderRepository;
import com.cloudstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final FolderRepository folderRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<FileResponse> listFiles(Optional<Long> folderId) {
        User user = getCurrentUser();
        List<File> files;
        if (folderId.isPresent()) {
            Folder folder = folderRepository.findById(folderId.get()).orElse(null);
            files = fileRepository.findAllByFolder(folder);
        } else {
            files = fileRepository.findAllByUser(user);
        }
        return files.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public FileResponse uploadFile(MultipartFile multipartFile, Optional<Long> folderId) throws IOException {
        User user = getCurrentUser();
        Folder folder = folderId.flatMap(folderRepository::findById).orElse(null);
        Path dirPath = Paths.get(uploadDir);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }
        String fileName = System.currentTimeMillis() + "_" + multipartFile.getOriginalFilename();
        Path filePath = dirPath.resolve(fileName);
        try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
            fos.write(multipartFile.getBytes());
        }
        File file = File.builder()
                .user(user)
                .name(multipartFile.getOriginalFilename())
                .path(filePath.toString())
                .size(multipartFile.getSize())
                .favourite(false)
                .deleted(false)
                .folder(folder)
                .build();
        fileRepository.save(file);
        return toResponse(file);
    }

    @Transactional
    public List<FileResponse> uploadFiles(MultipartFile[] files, Optional<Long> folderId) throws IOException {
        List<FileResponse> responses = new java.util.ArrayList<>();
        for (MultipartFile file : files) {
            responses.add(uploadFile(file, folderId));
        }
        return responses;
    }

    public byte[] downloadFile(Long fileId) throws IOException {
        File file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));
        return Files.readAllBytes(Paths.get(file.getPath()));
    }

    @Transactional
    public void deleteFile(Long fileId) {
        File file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));
        file.setDeleted(true);
        fileRepository.save(file);
    }

    @Transactional
    public FileResponse renameFile(Long fileId, RenameFileRequest request) {
        File file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));
        file.setName(request.getNewName());
        fileRepository.save(file);
        return toResponse(file);
    }

    @Transactional
    public FileResponse toggleFavourite(Long fileId) {
        File file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));
        file.setFavourite(!file.isFavourite());
        fileRepository.save(file);
        return toResponse(file);
    }

    @Transactional
    public void restoreFile(Long fileId) {
        File file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));
        file.setDeleted(false);
        fileRepository.save(file);
    }

    public List<FileResponse> listDeletedFiles(Optional<Long> folderId) {
        User user = getCurrentUser();
        List<File> files;
        if (folderId.isPresent()) {
            Folder folder = folderRepository.findById(folderId.get()).orElse(null);
            files = fileRepository.findAllByFolderAndDeletedTrue(folder);
        } else {
            files = fileRepository.findAllByUserAndDeletedTrue(user);
        }
        return files.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void permanentlyDeleteFile(Long fileId) {
        File file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));
        fileRepository.delete(file);
    }

    public List<FileResponse> searchFilesByName(String query) {
        User user = getCurrentUser();
        List<File> files = fileRepository.findAllByUser(user);
        String lowerQuery = query.toLowerCase();
        return files.stream()
            .filter(f -> f.getName() != null && f.getName().toLowerCase().contains(lowerQuery))
            .map(this::toResponse)
            .collect(java.util.stream.Collectors.toList());
    }

    private FileResponse toResponse(File file) {
        return new FileResponse(
                file.getId(),
                file.getName(),
                file.getSize(),
                file.isFavourite(),
                file.isDeleted(),
                file.getFolder() != null ? file.getFolder().getId() : null,
                file.getCreatedAt(),
                file.getUpdatedAt(),
                file.getUrl()
        );
    }

    @Transactional
    public FileResponse registerCloudFile(String name, String url, Long size, String type, Long folderId) {
        User user = getCurrentUser();
        Folder folder = folderId != null ? folderRepository.findById(folderId).orElse(null) : null;
        File file = File.builder()
                .user(user)
                .name(name)
                .url(url)
                .size(size)
                .favourite(false)
                .deleted(false)
                .folder(folder)
                .build();
        fileRepository.save(file);
        return toResponse(file);
    }
} 