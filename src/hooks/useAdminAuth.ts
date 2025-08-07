import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface AdminUser {
  id: string;
  username: string;
}

interface AdminAuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  isLoading: boolean;
}

export const useAdminAuth = () => {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const userStr = localStorage.getItem('admin_user');

      if (!token || !userStr) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        return;
      }

      // สำหรับ demo ให้ตรวจสอบแค่ token มีอยู่หรือไม่
      // ในการใช้งานจริงควรตรวจสอบใน database
      try {
        const user = JSON.parse(userStr);
        
        // ลองตรวจสอบ session ใน database (optional)
        const { data: session } = await supabase
          .from('admin_sessions')
          .select('id, expires_at, is_active')
          .eq('token', token)
          .eq('is_active', true)
          .single();

        // ตรวจสอบว่า token หมดอายุหรือยัง
        if (session) {
          const now = new Date();
          const expiresAt = new Date(session.expires_at);

          if (now > expiresAt) {
            // Token หมดอายุ
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            setAuthState({
              isAuthenticated: false,
              user: null,
              isLoading: false,
            });
            return;
          }
        }

        // Authentication สำเร็จ
        setAuthState({
          isAuthenticated: true,
          user: {
            id: user.id,
            username: user.username,
          },
          isLoading: false,
        });

      } catch (parseError) {
        // ถ้า parse user ไม่ได้
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }

    } catch (error) {
      console.error('Auth check error:', error);
      // ถ้าเกิด error ใดๆ ให้ clear storage
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      if (token) {
        // ปิดการใช้งาน session ใน database
        await supabase
          .from('admin_sessions')
          .update({ is_active: false })
          .eq('token', token);
      }

      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });

      // redirect ไป login page
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    ...authState,
    checkAuth,
    logout,
  };
};
