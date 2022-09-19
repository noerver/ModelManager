package com.jhb.modelmanager;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.SubMenu;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

public class BaseActivity extends AppCompatActivity {
    Menu mMenu;
    OnOptionsItemSelectedListener mSelectedListener;
    Toolbar toolbar;
    TextView toolbarTitle;
    RelativeLayout content;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_base);

        // 获取顶部的toolbar
        toolbar = findViewById(R.id.toolbar);
        toolbar.setTitle("");
        setSupportActionBar(toolbar);
        toolbar.setNavigationIcon(R.drawable.abc_vector_test);
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
        toolbarTitle = findViewById(R.id.toolbar_title);
        content = findViewById(R.id.rl_base_content);
    }

    public void setToolbarIcon(int resId){
        toolbar.setNavigationIcon(resId);
    }

    public void setToolbarMenuIconByItemId(int itemId){
        if(mMenu == null) return;
        if(mMenu.getItem(0) == null) return;
        SubMenu iconMenus = mMenu.getItem(0).getSubMenu();
        if(iconMenus == null) return;
        iconMenus.setGroupVisible(0,false);
        switch (itemId){
            case R.id.navigation_workspace:
                mMenu.findItem(R.id.navigation_scan).setVisible(true);
                break;
            case R.id.navigation_project:
                mMenu.findItem(R.id.navigation_scan).setVisible(true);
                mMenu.findItem(R.id.navigation_invite).setVisible(true);
                break;
            case R.id.navigation_team:
                mMenu.findItem(R.id.navigation_join).setVisible(true);
                mMenu.findItem(R.id.navigation_create).setVisible(true);
                break;
            case R.id.navigation_mine:
                break;
            default:
                break;
        }
//        for (int menuId : menuIds) {
//            mMenu.findItem(menuId).setVisible(true);
//        }
    }

    public void setToolBarTitle(String title){
        toolbarTitle.setText(title);
    }

    public void setContentLayout(int layoutId){
        LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View contentView = inflater.inflate(layoutId, null);
        ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT);
        content.addView(contentView, params);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.toolbar_menu,menu);
        this.mMenu = menu;
        mMenu.findItem(R.id.navigation_scan).setVisible(true);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        // Toast.makeText(BaseActivity.this,item.getTitle(),Toast.LENGTH_SHORT).show();
        if(this.mSelectedListener!=null){
            mSelectedListener.onSelected(item);
        }
        return super.onOptionsItemSelected(item);
    }

    public void setOptionsItemSelectedListener(OnOptionsItemSelectedListener listener){
        this.mSelectedListener = listener;
    }

    public interface OnOptionsItemSelectedListener{
        void onSelected(MenuItem item);
    }
}