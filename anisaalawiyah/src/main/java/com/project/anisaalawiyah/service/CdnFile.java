package com.project.anisaalawiyah.service;

import java.io.IOException;

public interface CdnFile {
    void putFile(byte[] content, String key) throws IOException;
    boolean fileIsExist(String key);
    boolean deleteFile(String key);
    String getUrl(String key);
}
