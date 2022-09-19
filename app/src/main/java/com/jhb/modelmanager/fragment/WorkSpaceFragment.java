package com.jhb.modelmanager.fragment;

import androidx.lifecycle.ViewModelProvider;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.jhb.modelmanager.R;
import com.jhb.modelmanager.fragment.viewmodel.WorkSpaceViewModel;

public class WorkSpaceFragment extends Fragment {

    private WorkSpaceViewModel mViewModel;

    public static WorkSpaceFragment newInstance() {
        return new WorkSpaceFragment();
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_work_space, container, false);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        mViewModel = new ViewModelProvider(this).get(WorkSpaceViewModel.class);
        // TODO: Use the ViewModel

    }

}