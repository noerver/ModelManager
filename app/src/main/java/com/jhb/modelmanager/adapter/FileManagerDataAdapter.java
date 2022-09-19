package com.jhb.modelmanager.adapter;

import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.jhb.modelmanager.R;
import com.jhb.modelmanager.activity.project.WebViewActivity;
import com.jhb.modelmanager.bean.FileBean;

import java.util.List;

public class FileManagerDataAdapter extends RecyclerView.Adapter<FileManagerDataAdapter.FileManagerDataViewHolder> {
    List<FileBean> mDataList;

    public FileManagerDataAdapter(List<FileBean> dataList){
        this.mDataList = dataList;
    }

    public void setDataList(List<FileBean> dataList){
        this.mDataList = dataList;
    }

    @NonNull
    @Override
    public FileManagerDataViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_item_project_list,null);
        FileManagerDataViewHolder viewHolder = new FileManagerDataViewHolder(view);
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Toast.makeText(getContext(), "" + viewHolder.getAdapterPosition(),Toast.LENGTH_SHORT).show();
                Intent intent  = new Intent(view.getContext(), WebViewActivity.class);
                intent.putExtra("ProjectListItemBean",mDataList.get(viewHolder.getAdapterPosition()));
                parent.getContext().startActivity(intent);
            }
        });
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull FileManagerDataViewHolder holder, int position) {
        holder.iv_fileIcon.setImageResource(mDataList.get(position).getIconRes());
        holder.tv_fileName.setText(mDataList.get(position).getFileName());
        holder.tv_fileDate.setText(mDataList.get(position).getFileDate());
        holder.tv_fileSize.setText(mDataList.get(position).getFileSize());
    }

    @Override
    public int getItemCount() {
        return mDataList.size();
    }

    static class FileManagerDataViewHolder extends RecyclerView.ViewHolder{
        public ImageView iv_fileIcon;
        public TextView tv_fileName,tv_fileDate,tv_fileSize;

        public FileManagerDataViewHolder(@NonNull View itemView) {
            super(itemView);
            iv_fileIcon = itemView.findViewById(R.id.iv_item_project_list_file_icon);
            tv_fileName = itemView.findViewById(R.id.tv_item_project_list_file_name);
            tv_fileDate = itemView.findViewById(R.id.tv_item_project_list_file_date);
            tv_fileSize = itemView.findViewById(R.id.tv_item_project_list_file_size);
        }
    }
}
