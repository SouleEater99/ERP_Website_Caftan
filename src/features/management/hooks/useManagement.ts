import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { User, Location, UserFormData, LocationFormData, LocationUpdateData } from '../types/management.types';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as User[];
    }
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Location[];
    }
  });
};

// Add user to BOTH users table AND Supabase Auth
export const useAddUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('🚀 Starting user creation process...');
      console.log(' User data received:', userData);
      
      try {
        // Step 1: Create user in Supabase Auth
        console.log('🔐 Step 1: Creating user in Supabase Auth...');
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: 'defaultPassword123!',
          email_confirm: true,
          user_metadata: {
            name: userData.name,
            role: userData.role
          }
        });

        if (authError) {
          console.error('❌ Error creating user in Supabase Auth:', authError);
          throw new Error(`Auth creation failed: ${authError.message}`);
        }

        console.log('✅ User created in Supabase Auth:', authData.user);

        // Step 2: Create user in users table with ONLY the columns that exist
        console.log('📊 Step 2: Creating user in users table...');
        
        const userTableData = {
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          // Remove these if they don't exist in your table:
          // created_at: new Date().toISOString(),
          // updated_at: new Date().toISOString()
        };

        console.log('📝 Inserting into users table:', userTableData);

        const { data: dbData, error: dbError } = await supabase
          .from('users')
          .insert([userTableData])
          .select()
          .single();

        if (dbError) {
          console.error('❌ Error creating user in users table:', dbError);
          
          // Cleanup auth user if database fails
          try {
            await supabase.auth.admin.deleteUser(authData.user.id);
            console.log('🧹 Cleaned up auth user after database failure');
          } catch (cleanupError) {
            console.error('⚠️ Failed to cleanup auth user:', cleanupError);
          }
          
          throw new Error(`Database creation failed: ${dbError.message}`);
        }

        console.log('✅ User created in users table:', dbData);

        return {
          success: true,
          user: dbData,
          auth_user: authData.user
        };

      } catch (error) {
        console.error('❌ Error in complete user creation process:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🎉 User creation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    },
    onError: (error) => {
      console.error('❌ Add user mutation error:', error);
    }
  });
};

export const useAddLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locationData: LocationFormData) => {
      const { data, error } = await supabase
        .from('locations')
        .insert({
          ...locationData,
          status: 'active',
          worker_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: LocationUpdateData) => {
      const { data, error } = await supabase
        .from('locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });
};