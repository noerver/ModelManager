package com.jhb.modelmanager.bean;

import java.io.Serializable;

public class FileBean implements Serializable {
    private int iconRes;
    private String fileName;
    private String fileDate;
    private long fileTime;// 用于排序
    private String fileSize;
    private String fileAbsolutePath;

    public FileBean(int iconRes, String fileName, String fileDate, String fileSize, String fileAbsolutePath) {
        this.iconRes = iconRes;
        this.fileName = fileName;
        this.fileDate = fileDate;
        this.fileSize = fileSize;
        this.fileAbsolutePath = fileAbsolutePath;
    }

    public int getIconRes() {
        return iconRes;
    }

    public void setIconRes(int iconRes) {
        this.iconRes = iconRes;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileDate() {
        return fileDate;
    }

    public void setFileDate(String fileDate) {
        this.fileDate = fileDate;
    }

    public long getFileTime() {
        return fileTime;
    }

    public void setFileTime(long fileTime) {
        this.fileTime = fileTime;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileAbsolutePath() {
        return fileAbsolutePath;
    }

    public void setFileAbsolutePath(String fileAbsolutePath) {
        this.fileAbsolutePath = fileAbsolutePath;
    }
}
