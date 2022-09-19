package com.jhb.modelmanager.fragment;

import androidx.lifecycle.ViewModelProvider;

import android.content.Intent;
import android.graphics.Rect;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.jhb.modelmanager.R;
import com.jhb.modelmanager.activity.project.FileManagerActivity;
import com.jhb.modelmanager.activity.project.WebViewActivity;
import com.jhb.modelmanager.bean.ProjectGridItemBean;
import com.jhb.modelmanager.bean.FileBean;
import com.jhb.modelmanager.fragment.viewmodel.ProjectViewModel;

import java.util.List;

public class ProjectFragment extends Fragment {

    private RecyclerView mGridView;
    private ProjectGridViewAdapter mGridAdapter;

    private RecyclerView mListView;
    private ProjectListViewAdapter mListAdapter;

    public static ProjectFragment newInstance() {
        return new ProjectFragment();
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_project, container, false);
        mGridView = root.findViewById(R.id.rv_grid_project);
        mGridView.setLayoutManager(new GridLayoutManager(getActivity(),4));
        mListView = root.findViewById(R.id.rv_list_project);
        mListView.setLayoutManager(new LinearLayoutManager(getActivity()));
        mListView.addItemDecoration(new ListViewSpaceDecoration(10));
        return root;
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        ProjectViewModel mViewModel = new ViewModelProvider(this).get(ProjectViewModel.class);
        // TODO: Use the ViewModel
        mViewModel.getGridViewData().observe(getViewLifecycleOwner(), items -> {
            mGridAdapter = new ProjectGridViewAdapter(items);
            mGridView.setAdapter(mGridAdapter);
        });
        mViewModel.getListViewData().observe(getViewLifecycleOwner(), items -> {
            mListAdapter = new ProjectListViewAdapter(items);
            mListView.setAdapter(mListAdapter);
        });
        mViewModel.initGridViewData();
//        mViewModel.initListViewData();
//        mViewModel.getFileFromSdcard();
    }

    class ProjectGridViewAdapter extends RecyclerView.Adapter<ProjectGridViewHolder> {
        List<ProjectGridItemBean> dataList;

        public ProjectGridViewAdapter(List<ProjectGridItemBean> list){
            dataList = list;
        }

        @NonNull
        @Override
        public ProjectGridViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_item_project_grid,null);
            ProjectGridViewHolder viewHolder = new ProjectGridViewHolder(view);
            view.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    switch (viewHolder.getAdapterPosition()){
                        case 0: // 文件管理
                            Intent intent  = new Intent(view.getContext(), FileManagerActivity.class);
                            startActivity(intent);
                            break;
                        default:
                            break;
                    }
                }
            });
            return viewHolder;
        }

        @Override
        public void onBindViewHolder(@NonNull ProjectGridViewHolder holder, int position) {
            holder.iv_icon.setImageResource(dataList.get(position).getIconRes());
            holder.tv_text.setText(dataList.get(position).getItemName());
        }

        @Override
        public int getItemCount() {
            return dataList.size();
        }
    }

    static class ProjectGridViewHolder extends RecyclerView.ViewHolder {
        public ImageView iv_icon;
        public TextView tv_text;
        public ProjectGridViewHolder(@NonNull View itemView) {
            super(itemView);
            iv_icon = itemView.findViewById(R.id.iv_item_project_grid_icon);
            tv_text = itemView.findViewById(R.id.tv_item_project_grid_text);
        }
    }

    class ProjectListViewAdapter extends RecyclerView.Adapter<ProjectListViewHolder> {
        List<FileBean> dataList;

        public ProjectListViewAdapter(List<FileBean> list){
            dataList = list;
        }

        @NonNull
        @Override
        public ProjectListViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_item_project_list,null);
            ProjectListViewHolder viewHolder = new ProjectListViewHolder(view);
            view.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    // Toast.makeText(getContext(), "" + viewHolder.getAdapterPosition(),Toast.LENGTH_SHORT).show();
                    Intent intent  = new Intent(view.getContext(), WebViewActivity.class);
                    intent.putExtra("ProjectListItemBean",dataList.get(viewHolder.getAdapterPosition()));
                    startActivity(intent);
                }
            });
            return viewHolder;
        }

        @Override
        public void onBindViewHolder(@NonNull ProjectListViewHolder holder, int position) {
            holder.iv_fileIcon.setImageResource(dataList.get(position).getIconRes());
            holder.tv_fileName.setText(dataList.get(position).getFileName());
            holder.tv_fileDate.setText(dataList.get(position).getFileDate());
            holder.tv_fileSize.setText(dataList.get(position).getFileSize());
        }

        @Override
        public int getItemCount() {
            return dataList.size();
        }

    }

    static class ProjectListViewHolder extends RecyclerView.ViewHolder {
        public ImageView iv_fileIcon;
        public TextView tv_fileName,tv_fileDate,tv_fileSize;
        public ProjectListViewHolder(@NonNull View itemView) {
            super(itemView);
            iv_fileIcon = itemView.findViewById(R.id.iv_item_project_list_file_icon);
            tv_fileName = itemView.findViewById(R.id.tv_item_project_list_file_name);
            tv_fileDate = itemView.findViewById(R.id.tv_item_project_list_file_date);
            tv_fileSize = itemView.findViewById(R.id.tv_item_project_list_file_size);
        }
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