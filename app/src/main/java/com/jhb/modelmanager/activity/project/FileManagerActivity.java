package com.jhb.modelmanager.activity.project;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.DialogInterface;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Message;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.jhb.modelmanager.BaseActivity;
import com.jhb.modelmanager.R;
import com.jhb.modelmanager.adapter.FileManagerDataAdapter;
import com.jhb.modelmanager.bean.FileBean;
import com.jhb.modelmanager.fragment.ProjectFragment;
import com.jhb.modelmanager.view.InputDialog;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class FileManagerActivity extends BaseActivity implements View.OnClickListener, SearchView.OnQueryTextListener {
    HandlerThread mLogicHandlerThread = new HandlerThread("FileManagerActivityHandlerThread");
    Handler mLogicHandler;
    FloatingActionButton mMkDirButton;
    InputDialog mInputDialog;
    SearchView mQueryView;
    RecyclerView mFileDataView;
    FileManagerDataAdapter mFileDataAdapter;
    TextView mSortButton;
    List<FileBean> mFileDataList = new ArrayList<>();
    private SimpleDateFormat mDateFormat = new SimpleDateFormat("yyyy/MM/dd hh:mm");
    private boolean isDescSort = true;

    // TextView mLogText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentLayout(R.layout.activity_file_manager);

        mInputDialog = new InputDialog(
                FileManagerActivity.this,
                getLayoutInflater().inflate(R.layout.layout_dialog_input,null),
                R.style.InputDialogStyle);
        mInputDialog.setCancelable(false);
        mInputDialog.setOnConfirmListener(this);
        mInputDialog.setOnCancelListener(this);

        mMkDirButton = findViewById(R.id.fab_file_manager_add);
        mMkDirButton.setOnClickListener(this);

        mQueryView = findViewById(R.id.sv_file_manager_query);
        mQueryView.setOnQueryTextListener(this);

        mSortButton = findViewById(R.id.tv_file_manager_sort);
        mSortButton.setOnClickListener(this);

        mFileDataView = findViewById(R.id.rv_file_manager_file_data_view);
        mFileDataView.setLayoutManager(new LinearLayoutManager(FileManagerActivity.this));
        mFileDataView.addItemDecoration(new ListViewSpaceDecoration(10));
        mFileDataAdapter = new FileManagerDataAdapter(mFileDataList);
        mFileDataView.setAdapter(mFileDataAdapter);

//        mLogText = findViewById(R.id.tv_file_manager_log);

        mLogicHandlerThread.start();
        mLogicHandler = new Handler(mLogicHandlerThread.getLooper()){
            @Override
            public void handleMessage(@NonNull Message msg) {
                super.handleMessage(msg);
                switch (msg.what){
                    case 0:
                        getFileFromSdcard();
                        break;
                    case 1:
//                        String log = (String) msg.obj;
//                        runOnUiThread(new Runnable() {
//                            @Override
//                            public void run() {
//                                mLogText.setText(mLogText.getText().toString() + "\n" + log);
//                            }
//                        });
                        break;
                    default:
                        break;
                }
            }
        };
        mLogicHandler.sendEmptyMessage(0);
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()){
            case R.id.fab_file_manager_add:
                mInputDialog.show();
                break;
            case R.id.btn_input_dialog_file_manager_confirm:
                System.out.println(mInputDialog.getInputText());
                break;
            case R.id.btn_input_dialog_file_manager_cancel:
                mInputDialog.dismiss();
                break;
            case R.id.tv_file_manager_sort:
                isDescSort = !isDescSort;
                mSortButton.setText(isDescSort ? "时间由近到远↓":"时间由远到近↓");
                setFileDataList(mFileDataList,isDescSort);
                break;
            default:
                break;
        }
    }

    @Override
    public boolean onQueryTextSubmit(String query) {
        System.out.println("query : " + query);
        insertTestData(10);
        return false;
    }

    private void insertTestData(int num) {
        if(mFileDataList == null) return;
        for (int i = 0; i < num; i++) {
            FileBean bean = new FileBean(
                    R.mipmap.ic_launcher,
                    "TestData" + i,
                    mDateFormat.format(System.currentTimeMillis()),
                    "20M",
                    "");
            bean.setFileTime((long) (System.currentTimeMillis() + (i * 1000)));
            mFileDataList.add(bean);
        }
        setFileDataList(mFileDataList,isDescSort);
    }

    @Override
    public boolean onQueryTextChange(String newText) {
        // System.out.println("newText : " + newText);
        return false;
    }

    public void getFileFromSdcard(){
        String[] formats = {".json"};
        String[] sizeUnit = {"B","KB","MB","GB","TB"};
        ArrayList<File> jsonList = new ArrayList<>();
        List<FileBean> list = new ArrayList<>();
        Toast.makeText(FileManagerActivity.this,"start scan file",Toast.LENGTH_LONG).show();
        getFormatFile(jsonList, Environment.getExternalStorageDirectory().getPath() + File.separator,formats);
        Toast.makeText(FileManagerActivity.this,"stop scan file ! file size : " + jsonList.size(),Toast.LENGTH_LONG).show();
        for (int i = 0; i < jsonList.size(); i++) {
            File file = jsonList.get(i);
//            Toast.makeText(FileManagerActivity.this,file.getName() + "---" + file.getPath(),Toast.LENGTH_LONG).show();
            FileInputStream fis = null;
            try {
                fis = new FileInputStream(file);
                float fileSize = fis.available();
                int unitIndex = 0;
                while(fileSize > 1024){
                    fileSize /= 1024;
                    unitIndex ++;
                }
                FileBean bean = new FileBean(
                        R.mipmap.ic_launcher,
                        file.getName(),
                        mDateFormat.format(file.lastModified()),
                        String.format("%.2f",fileSize) + " " + sizeUnit[unitIndex],
                        file.getAbsolutePath());
                bean.setFileTime(file.lastModified());
                list.add(bean);
                setFileDataList(list,isDescSort);
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
//        mLogicHandler.sendMessage(mLogicHandler.obtainMessage(1,"dir path : " + path));
        File[] files = dir.listFiles();
//        mLogicHandler.sendMessage(mLogicHandler.obtainMessage(1,"dir file number : " + (files == null ? 0 : files.length)));
        if(files == null || files.length == 0) return;
        for (File item : files) {
            if (item.isDirectory()) {
                getFormatFile(fileList, item.getPath(), formats);
            } else {
                for (String format : formats) {
                    if (item.getName().endsWith(format)) {
//                        mLogicHandler.sendMessage(mLogicHandler.obtainMessage(1,"file name : " + item.getName()));
                        fileList.add(item);
                        break;
                    }
                }
            }
            // System.out.println(item.getName() + "---" + item.getPath());
        }
    }

    private void sortListByDate(boolean desc){
        if(mFileDataList.size() <= 1) return;
        Collections.sort(mFileDataList, new Comparator<FileBean>() {

            @Override
            public int compare(FileBean fileBean, FileBean t1) {
                return (int) (desc ? t1.getFileTime() - fileBean.getFileTime() : fileBean.getFileTime() - t1.getFileTime());
            }
        });
    }

    private void setFileDataList(List<FileBean> dataList, boolean desc){
        System.out.println(dataList.size());
        mFileDataList = dataList;
        sortListByDate(desc);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mFileDataAdapter.setDataList(mFileDataList);
                mFileDataAdapter.notifyDataSetChanged();
            }
        });
    }

    static class ListViewSpaceDecoration extends RecyclerView.ItemDecoration {
        private final int space;

        public ListViewSpaceDecoration(int space){
            this.space = space;
        }

        @Override
        public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
            outRect.top = space;
            outRect.bottom = space;
            // super.getItemOffsets(outRect, view, parent, state);
        }
    }
}