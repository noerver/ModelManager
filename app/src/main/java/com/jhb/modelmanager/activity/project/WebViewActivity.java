package com.jhb.modelmanager.activity.project;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.jhb.modelmanager.BaseActivity;
import com.jhb.modelmanager.R;
import com.jhb.modelmanager.bean.FileBean;

public class WebViewActivity extends BaseActivity {

    WebView mDataView;
    String mLoadFilePath;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentLayout(R.layout.activity_web_view);

        mDataView = findViewById(R.id.wv_web_data_view);
        Intent intent = getIntent();
        FileBean bean = (FileBean) intent.getSerializableExtra("ProjectListItemBean");
        mLoadFilePath = bean.getFileAbsolutePath();
        if(TextUtils.isEmpty(mLoadFilePath)) {
            Toast.makeText(this,"文件路径获取失败！",Toast.LENGTH_SHORT).show();
            return;
        }
        setTitle(bean.getFileName());
        System.out.println(mLoadFilePath);
        mDataView.addJavascriptInterface(new JsInterface(),"android");

        // 加载assets中资源
        // mDataView.loadUrl("file:///android_asset/index.html");
        WebSettings settings =  mDataView.getSettings();
        settings.setDomStorageEnabled(true);
        settings.setJavaScriptEnabled(true);
        settings.setBlockNetworkImage(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setUseWideViewPort(true); // 将图片调整到适合webview的大小
        settings.setLoadWithOverviewMode(true);  // 缩放至屏幕的大小 作者：永远的祈妹 https://www.bilibili.com/read/cv16643081/ 出处：bilibili
        settings.setSupportZoom(true);//启用缩放功能
        settings.setBuiltInZoomControls(true);//使用WebView内置的缩放功能
        settings.setDisplayZoomControls(false);//隐藏屏幕中的虚拟缩放按钮 作者：永远的祈妹 https://www.bilibili.com/read/cv16643081/ 出处：bilibili
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            CookieManager.getInstance().setAcceptThirdPartyCookies(mDataView,true);
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        } // 作者：永远的祈妹 https://www.bilibili.com/read/cv16643081/ 出处：bilibili

        mDataView.setWebViewClient(new MyWevViewClient());
        mDataView.loadUrl("file:///android_asset/index.html");

    }

    // 此类的方法提供给H5调用
    public class JsInterface{
        @JavascriptInterface
        public void release(){
            if(mDataView != null){mDataView.destroy();}
        }
    }

    public class MyWevViewClient extends WebViewClient{
        //    1.shouldOverrideUrlLoading并不是每次都在onPageStarted之前开始调用的，就是说一个新的URL不是每次都经过shouldOverrideUrlLoading的，只有在调用webview.loadURL的时候才会调用。若此方法的返回值  return super.shouldOverrideUrlLoading(view, url);则会跳到手机浏览器，return false代表webview处理url是在webview内部执行的，return true代表webview处理url是根据程序来执行的。
        //    2.OnReceivedError(),这个方法是加载出错的时候响应，因为我们可以用来加载出错页面
        //    3.OnLoadResource()，这个方法是在加载网络资源的时候触发，无论是图片，json,还要是网络资源，都会触发此方法。
        //    4.onPageStarted()，当webview开始加载url的时候，会进入这个方法。
        //    5.OnPageFinished()，当url加载完成后，触发次方法，我的项目中就是用这个方法进行拦截的，举个例子，如我要判断当前url如果是index的话，我要进行一个toast,如下方，就可以触发toast。
        //    6.shouldInterceptRequest(WebView view, WebResourceRequest request) ，这个方法我们可以用来加载一些本地资源，如混合开发中，基本所有的页面都是由H5进行实现的，而H5页面中的一些图片肯定也是对应的一个url，因此在此方法中，我们可以通过request拿到这个图片你的url，当判断是这个url的时候我们就可以加载本地资源，替换要加载的url，这样做不仅加快了响应速度，显示速度，而且省流量，也因此我们可以使用这个来做自定义缓存，文章下方会详细介绍。
        //    7.shouldInterceptRequest(WebView view, String url)，这个方法与上方的方法基本没有什么不同，功能是一样的，String参数被后来的WebResourceRequest参数所替代，这样可以拿到请求是post还是get，header等诸多信息，区别就是这个方法是4.4之前的，而上面的方法是4.4之后的(好像是4.4)这个方法已经被废弃，但是楼主观察过，在执行顺序上是这个方法先执行，而当我们做自定义缓存的时候，4.4之前是没有上面那个方法的，为了适配，所以建议还是使用此方法。

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            if(TextUtils.isEmpty(mLoadFilePath)) return;
            mDataView.loadUrl("javascript:setFilePath('"+mLoadFilePath+"')");
        }
    }

    @Override
    protected void onDestroy() {
        if(mDataView != null){mDataView.destroy();}
        super.onDestroy();
    }

}