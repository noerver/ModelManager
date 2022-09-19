package com.jhb.modelmanager.bean;

public class ProjectGridItemBean {
    private int iconRes;
    private String itemName;

    public ProjectGridItemBean(int iconRes, String itemName) {
        this.iconRes = iconRes;
        this.itemName = itemName;
    }

    public int getIconRes() {
        return iconRes;
    }

    public void setIconRes(int iconRes) {
        this.iconRes = iconRes;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
}
