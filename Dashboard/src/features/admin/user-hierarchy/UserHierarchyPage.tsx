import React, { useState, useEffect } from 'react';
import { usersApi } from '../../../api/endpoints';
import type { UserModel } from '../../../types/models';
import { usePortalMessages } from '../../../shared/hooks/usePortalMessages';
import { Network } from 'lucide-react';

interface TreeNode {
  user: UserModel;
  children: TreeNode[];
}

export const UserHierarchyPage: React.FC = () => {
  const { getMessage } = usePortalMessages();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const list = await usersApi.list();
        setUsers(list);
      } catch (err) {
        console.error("Failed to load users list for hierarchy:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Helper to build hierarchy tree from user list dynamically
  const buildTree = (userList: UserModel[]): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    
    // Create node wrappers
    userList.forEach(u => {
      nodeMap.set(u.fullName.toLowerCase().trim(), { user: u, children: [] });
    });
    
    const roots: TreeNode[] = [];
    
    userList.forEach(u => {
      const node = nodeMap.get(u.fullName.toLowerCase().trim())!;
      if (u.reportsToName) {
        const parentNode = nodeMap.get(u.reportsToName.toLowerCase().trim());
        if (parentNode) {
          parentNode.children.push(node);
        } else {
          // Parent reportsTo user not found, treat as root
          roots.push(node);
        }
      } else {
        // No parent listed, is root
        roots.push(node);
      }
    });
    
    return roots;
  };

  const roots = buildTree(users);

  // Recursive Node renderer
  const OrgNode: React.FC<{ node: TreeNode }> = ({ node }) => {
    const hasChildren = node.children.length > 0;
    const initial = node.user.fullName.charAt(0).toUpperCase();

    const getAvatarBg = (char: string) => {
      switch (char) {
        case 'R': return 'bg-violet-600';
        case 'G': return 'bg-orange-600';
        case 'C': return 'bg-rose-600';
        case 'S': return 'bg-emerald-600';
        default: return 'bg-blue-600';
      }
    };

    return (
      <div className="flex flex-col items-center relative">
        {/* User Node Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 w-56 relative z-10 hover:border-blue-500 hover:shadow-md transition-all">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${getAvatarBg(initial)}`}>
            {initial}
          </div>
          <div className="overflow-hidden text-left">
            <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{node.user.fullName}</h4>
            <p className="text-[10px] text-purple-800 font-bold leading-normal truncate">{node.user.roleName || 'Viewer'}</p>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">{node.user.userCode}</p>
          </div>
        </div>

        {/* Children Render */}
        {hasChildren && (
          <div className="flex flex-col items-center mt-6 relative w-full">
            {/* Top connecting vertical line */}
            <div className="absolute top-[-24px] w-px h-6 bg-slate-300" />
            
            {/* Horizontal line wrapper */}
            <div className="flex gap-8 relative pt-2">
              {/* Connecting horizontal border */}
              {node.children.length > 1 && (
                <div className="absolute top-0 left-[112px] right-[112px] h-px bg-slate-300" />
              )}

              {node.children.map((child, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === node.children.length - 1;
                
                return (
                  <div key={child.user.userId} className="relative flex flex-col items-center">
                    {/* Corner connecting vertical lines for multiple children */}
                    {node.children.length > 1 && (
                      <div className={`absolute top-[-8px] w-px h-2 bg-slate-300 ${
                        isFirst ? 'left-1/2' : isLast ? 'right-1/2' : ''
                      }`} />
                    )}
                    
                    <OrgNode node={child} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-xs font-medium text-slate-400">Loading user hierarchy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Title */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">{getMessage('User Hierarchy')}</h2>
          <p className="text-[11px] text-slate-600 font-medium font-mono">
            Interactive organization tree based on reporting configuration
          </p>
        </div>
        
        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 border rounded-lg">
          <Network className="w-3.5 h-3.5 text-blue-500" />
          <span>Auto-generated Hierarchy</span>
        </div>
      </div>

      {/* Tree Wrapper Panel */}
      <div 
        className="bg-white border border-slate-200 rounded-xl p-8 overflow-auto flex justify-center min-h-[500px]"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex gap-12 items-start py-4">
          {roots.length === 0 ? (
            <p className="text-slate-400 font-medium text-xs">No active users mapped in org structure.</p>
          ) : (
            roots.map(root => (
              <OrgNode key={root.user.userId} node={root} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHierarchyPage;
