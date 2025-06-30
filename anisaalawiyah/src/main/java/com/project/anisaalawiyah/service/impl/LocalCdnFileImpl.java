package com.project.anisaalawiyah.service.impl;

import com.project.anisaalawiyah.service.CdnFile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class LocalCdnFileImpl implements CdnFile {

    private final String basePath = System.getProperty("user.dir") + "/uploads/";
    private final String baseUrl = "http://localhost:8081/files/";

    @Override
    public void putFile(byte[] content, String key) throws IOException {
        Path path = Paths.get(basePath + key);
        Files.createDirectories(path.getParent());
        Files.write(path, content);
    }

    @Override
    public boolean fileIsExist(String key) {
        return Files.exists(Paths.get(basePath + key));
    }

    @Override
    public boolean deleteFile(String key) {
        try {
            return Files.deleteIfExists(Paths.get(basePath + key));
        } catch (IOException e) {
            return false;
        }
    }

    @Override
    public String getUrl(String key) {
        return baseUrl + key;
    }
}
