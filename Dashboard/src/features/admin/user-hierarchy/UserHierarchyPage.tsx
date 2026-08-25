import React from 'react';
import { useDatabase } from '../../../shared/hooks/useDatabase';
import type { User } from '../../../types/domain';
import { Network } from 'lucide-react';

interface TreeNode {
  user: User;
  children: TreeNode[];
}

export const UserHierarchyPage: React.FC = () => {
  const { users, getMessage } = useDatabase();

  // Helper to build hierarchy tree from user list dynamically
  const buildTree = (userList: User[]): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    
    // Create node wrappers
    userList.forEach(u => {
      nodeMap.set(u.name.toLowerCase().trim(), { user: u, children: [] });
    });
    
    const roots: TreeNode[] = [];
    
    userList.forEach(u => {
      const node = nodeMap.get(u.name.toLowerCase().trim())!;
      if (u.reportsTo) {
        const parentNode = nodeMap.get(u.reportsTo.toLowerCase().trim());
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
    const initial = node.user.name.charAt(0).toUpperCase();

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
      <div className="flex flex-col items-center shrink-0">
        {/* User Node Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm w-44 flex flex-col items-center gap-1.5 border-t-4 border-t-blue-500 hover:shadow-md transition-shadow relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner ${getAvatarBg(initial)}`}>
            {initial}
          </div>
          <div className="text-[12px] text-slate-800 font-bold leading-tight text-center truncate w-full">
            {node.user.name}
          </div>
          <div className="text-[9px] font-mono text-slate-400 leading-none truncate w-full text-center">
            {node.user.role}
          </div>
          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
            node.user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}>
            {node.user.status}
          </span>
        </div>

        {/* Tree Connectors & Children rendering */}
        {hasChildren && (
          <>
            {/* Top link line */}
            <div className="w-0.5 h-6 bg-blue-300"></div>

            {/* Children container */}
            <div className="relative flex align-top gap-8">
              {node.children.length > 1 && (
                /* Sibling connector bridge */
                <div 
                  className="absolute top-0 h-0.5 bg-blue-300"
                  style={{
                    left: '88px', // offset halfway across first child card
                    right: '88px', // offset halfway across last child card
                  }}
                />
              )}

              {node.children.map((child) => (
                <div key={child.user.id} className="relative flex flex-col items-center">
                  {/* Top tick line under sibling bridge */}
                  {node.children.length > 1 && (
                    <div className="w-0.5 h-3 bg-blue-300"></div>
                  )}
                  <OrgNode node={child} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-0.5">{getMessage('User Hierarchy')}</h2>
        <p className="text-[11px] text-slate-600 font-medium font-mono">
          Visual representation of report paths
        </p>
      </div>

      {/* Hierarchy Viewport Wrapper */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-inner overflow-auto min-h-[500px] flex justify-center">
        <div className="flex gap-16 justify-center items-start min-w-max">
          {roots.length === 0 ? (
            <div className="text-center text-slate-400 font-medium py-16">
              No hierarchy records found. Set users reporting paths in User Master.
            </div>
          ) : (
            roots.map(rootNode => (
              <OrgNode key={rootNode.user.id} node={rootNode} />
            ))
          )}
        </div>
      </div>

      {/* Footer Info bar */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex gap-2">
        <Network className="w-4 h-4 text-blue-500 shrink-0" />
        <p className="font-semibold leading-relaxed">
          Dynamic calculations construct this tree in real time. Adjust reportsTo fields inside User Master to modify tree nodes dynamically.
        </p>
      </div>
    </div>
  );
};

export default UserHierarchyPage;
