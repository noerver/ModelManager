package com.jhb.modelmanager.view;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.drawable.Drawable;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.jhb.modelmanager.R;

public class InputDialog extends Dialog {
    EditText mDirName;
    Button mCancel,mConfirm;
    Drawable mClearDrawable;
    boolean isClearIconShow = false;
    boolean isConfirmEnabled = false;

    int editTextHeight;
    int editTextWidth;
    int editTextPaddingRight;
    int editTextPaddingLeft;
    int editTextPaddingTop;
    int editTextPaddingBottom;
    int clearIconPaddingRight;
    int clearIconPaddingLeft;
    int clearIconPaddingTop;
    int clearIconPaddingBottom;
    int clearIconHeight;
    int clearIconWidth;


    public InputDialog(@NonNull Context context, View layout, int style) {
        super(context,style);
        setContentView(layout);
        initView(layout);
        this.setOnShowListener(new OnShowListener() {
            @Override
            public void onShow(DialogInterface dialogInterface) {
                // System.out.println("onShow");
                mDirName.setFocusable(true);
                mDirName.setFocusableInTouchMode(true);
                mDirName.requestFocus();
            }
        });
        mDirName.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean b) {
                getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);
            }
        });

        mClearDrawable = context.getDrawable(android.R.drawable.ic_menu_close_clear_cancel);

//        mDirName.setCompoundDrawablesWithIntrinsicBounds(
//                null,
//                null,
//                mClearDrawable,
//                null);

        mDirName.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch (motionEvent.getAction()){
                    case MotionEvent.ACTION_UP:
                        editTextHeight = mDirName.getHeight();
                        editTextWidth = mDirName.getWidth();
                        editTextPaddingRight = mDirName.getPaddingRight();
                        editTextPaddingLeft = mDirName.getPaddingLeft();
                        editTextPaddingTop = mDirName.getPaddingTop();
                        editTextPaddingBottom = mDirName.getPaddingBottom();
                        clearIconPaddingRight =  mDirName.getCompoundPaddingRight();
                        clearIconPaddingLeft =  mDirName.getCompoundPaddingLeft();
                        clearIconPaddingTop =  mDirName.getCompoundPaddingTop();
                        clearIconPaddingBottom =  mDirName.getCompoundPaddingBottom();
                        clearIconHeight = mClearDrawable.getIntrinsicHeight();
                        clearIconWidth = mClearDrawable.getIntrinsicWidth();
                        System.out.println(mDirName.getWidth()+ "---" + mDirName.getHeight());
                        System.out.println("x,y:"+ motionEvent.getX() + "," + motionEvent.getY());
                        if(isClearIconShow && isClearIconClicked(motionEvent.getX(),motionEvent.getY())){
                            mDirName.setText("");
                            mDirName.setCompoundDrawablesWithIntrinsicBounds(null, null, null, null);
                            isClearIconShow = false;
                        }
                        break;
                    default:
                        break;
                }
                return false;
            }
        });
        mDirName.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if(mDirName.getText().length() > 0){
                    if(!isClearIconShow) {
                        mDirName.setCompoundDrawablesWithIntrinsicBounds(
                                null,
                                null,
                                mClearDrawable,
                                null);
                        isClearIconShow = true;
                    }
                    if(!isConfirmEnabled){
                        isConfirmEnabled = true;
                        mConfirm.setEnabled(true);
                    }
                    return;
                }
                if(mDirName.getText().length() == 0){
                    if(isClearIconShow){
                        mDirName.setCompoundDrawablesWithIntrinsicBounds(
                                null,
                                null,
                                null,
                                null);
                        isClearIconShow = false;
                    }
                    if(isConfirmEnabled){
                        isConfirmEnabled = false;
                        mConfirm.setEnabled(false);
                    }
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
    }

    private void initView(View layout){
        mDirName = layout.findViewById(R.id.et_input_dialog_file_manager_dir);
        mCancel = layout.findViewById(R.id.btn_input_dialog_file_manager_cancel);
        mConfirm = layout.findViewById(R.id.btn_input_dialog_file_manager_confirm);
    }

    public void setOnCancelListener(View.OnClickListener cancelListener){
        mCancel.setOnClickListener(cancelListener);
    }

    public void setOnConfirmListener(View.OnClickListener confirmListener){
        mConfirm.setOnClickListener(confirmListener);
    }

    public String getInputText(){
        return mDirName == null ? "" : mDirName.getText().toString();
    }

    private boolean isClearIconClicked(float x,float y){
        // System.out.println("x,y:"+ x + "," + y);
        int iconRight = editTextWidth - editTextPaddingRight;
        int iconBottom = editTextHeight - editTextPaddingBottom;
        boolean xFlag = false,yFlag = false;
        if(x > iconRight - clearIconWidth && x < iconRight){
            xFlag = true;
        }
        if(y > iconBottom - clearIconHeight && y < iconBottom){
            yFlag = true;
        }
        return xFlag && yFlag;
    }

    public void dismiss(){
        super.dismiss();
        mDirName.setText("");
    }

}
