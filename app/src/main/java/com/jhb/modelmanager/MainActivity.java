package com.jhb.modelmanager;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import android.os.Build;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class MainActivity extends BaseActivity {

//    WebView mDataView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentLayout(R.layout.activity_main);

        // 获取页面上的底部导航栏控件
        BottomNavigationView navView = findViewById(R.id.bottom_nav_view);
        // 保留menu item icon的原图颜色
        navView.setItemIconTintList(null);

        // 配置navigation与底部菜单之间的联系
        // 底部菜单的样式里面的item里面的ID与navigation布局里面指定的ID必须相同，否则会出现绑定失败的情况
        AppBarConfiguration appBarConfiguration = new AppBarConfiguration.Builder(
                R.id.navigation_workspace,R.id.navigation_project,R.id.navigation_team,R.id.navigation_mine)
                .build();
        // 建立fragment容器的控制器，这个容器就是页面的上的fragment容器
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);

        // 启动
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
        NavigationUI.setupWithNavController(navView, navController);

        if(mSelectedListener == null) {
            setOptionsItemSelectedListener(new OnOptionsItemSelectedListener() {
                @Override
                public void onSelected(MenuItem item) {
                    switch (item.getItemId()){
                        case R.id.navigation_scan:
                            Toast.makeText(MainActivity.this,item.getTitle(),Toast.LENGTH_LONG).show();
                            break;
                        case R.id.navigation_invite:
                            Toast.makeText(MainActivity.this,item.getTitle(),Toast.LENGTH_LONG).show();
                            break;
                        case R.id.navigation_join:
                            Toast.makeText(MainActivity.this,item.getTitle(),Toast.LENGTH_LONG).show();
                            break;
                        case R.id.navigation_create:
                            Toast.makeText(MainActivity.this,item.getTitle(),Toast.LENGTH_LONG).show();
                            break;
                        default:
                            break;
                    }
                }
            });
        }
        navView.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                NavigationUI.onNavDestinationSelected(item,navController);
                // toolbarTitle.setText(item.getTitle());
                setToolBarTitle(item.getTitle().toString());
                setToolbarIcon(R.drawable.abc_vector_test);

                setToolbarMenuIconByItemId(item.getItemId());
                return false;
            }
        });

    }
}