package com.jhb.modelmanager.fragment.viewmodel;

import android.os.Environment;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.jhb.modelmanager.R;
import com.jhb.modelmanager.bean.ProjectGridItemBean;
import com.jhb.modelmanager.bean.FileBean;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class ProjectViewModel extends ViewModel {
    // TODO: Implement the ViewModel
    private MutableLiveData<List<ProjectGridItemBean>> mGridData = new MutableLiveData<List<ProjectGridItemBean>>();
    private MutableLiveData<List<FileBean>> mListData = new MutableLiveData<List<FileBean>>();
    private SimpleDateFormat mDateFormat = new SimpleDateFormat("yyyy/MM/dd hh:mm");

    public void initGridViewData(){
        List<ProjectGridItemBean> list = new ArrayList<>();
        list.add(new ProjectGridItemBean(R.mipmap.ic_launcher,"文件管理"));
        list.add(new ProjectGridItemBean(R.mipmap.ic_launcher,"视点管理"));
        list.add(new ProjectGridItemBean(R.mipmap.ic_launcher,"成员管理"));
        list.add(new ProjectGridItemBean(R.mipmap.ic_launcher,"问题记录"));
        list.add(new ProjectGridItemBean(R.mipmap.ic_launcher,"项目动态"));
        list.add(new ProjectGridItemBean(R.mipmap.ic_launcher,"项目分析"));
        setGridViewData(list);
    }

    public void setGridViewData(List<ProjectGridItemBean> gridData){
        mGridData.setValue(gridData);
    }

    public LiveData<List<ProjectGridItemBean>> getGridViewData(){
        return mGridData;
    }

    public void initListViewData(){
        List<FileBean> list = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            list.add(new FileBean(
                            R.mipmap.ic_launcher,
                            "file" + i,
                            mDateFormat.format(System.currentTimeMillis()),
                            (20+i) + "MB",
                            ""));
        }
        setListViewData(list);
    }

    public void setListViewData(List<FileBean> listData){
        mListData.setValue(listData);
    }

    public LiveData<List<FileBean>> getListViewData(){
        return mListData;
    }

    public void getRecentFile(){

    }

    public void getFileFromSdcard(){
        String[] formats = {".json"};
        String[] sizeUnit = {"B","KB","MB","GB","TB"};
        ArrayList<File> jsonList = new ArrayList<>();
        List<FileBean> list = new ArrayList<>();
        getFormatFile(jsonList,Environment.getExternalStorageDirectory().getPath() + File.separator,formats);
        for (int i = 0; i < jsonList.size(); i++) {
            File file = jsonList.get(i);
            System.out.println(file.getName() + "---" + file.getPath());
            FileInputStream fis = null;
            try {
                fis = new FileInputStream(file);
                float fileSize = fis.available();
                int unitIndex = 0;
                while(fileSize > 1024){
                    fileSize /= 1024;
                    unitIndex ++;
                }
                list.add(new FileBean(
                        R.mipmap.ic_launcher,
                        file.getName(),
                        mDateFormat.format(file.lastModified()),
                        String.format("%.2f",fileSize) + " " + sizeUnit[unitIndex],
                        file.getAbsolutePath()));
                setListViewData(list);
            } catch (IOException e) {
                e.printStackTrace();
            }finally {
                try {
                    if (fis != null) fis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }
    }

    private void getFormatFile(ArrayList<File> fileList,String path,String[] formats){
        if(fileList == null ) fileList = new ArrayList<>();
        File dir = new File(path);
        File[] files = dir.listFiles();
        if(files == null || files.length == 0) return;
        for (File item : files) {
            if (item.isDirectory()) {
                getFormatFile(fileList, item.getPath(), formats);
            } else {
                for (String format : formats) {
                    if (item.getName().endsWith(format)) {
                        fileList.add(item);
                        break;
                    }
                }
            }
            // System.out.println(item.getName() + "---" + item.getPath());
        }
    }
}