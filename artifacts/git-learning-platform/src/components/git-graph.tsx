import { RepoState } from '@workspace/api-client-react';
import ReactFlow, { Background, Controls, Node, Edge, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { useMemo } from 'react';

interface GitGraphProps {
  repoState: RepoState;
}

export default function GitGraph({ repoState }: GitGraphProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // This is a simple vertical layout algorithm for the git graph
    let yPos = 50;
    const xPos = 150;

    // Convert commits to an array and sort by roughly time or order (since we don't have timestamps, we rely on parent links)
    // Actually we can just iterate over them. We should ideally do a topological sort.
    const commitList = Object.values(repoState.commits);
    
    // We will just position them arbitrarily for now, with children above parents.
    // In a real implementation we would do a proper graph layout.
    
    // Quick layout mapping
    const positionMap: Record<string, {x: number, y: number}> = {};
    
    // Let's do a simple layout
    let currentY = 50;
    
    // Create a list of branches pointing to commits
    const branchLabelsByCommit: Record<string, string[]> = {};
    Object.entries(repoState.branches).forEach(([branchName, commits]) => {
      if (commits.length > 0) {
        const tip = commits[commits.length - 1];
        if (!branchLabelsByCommit[tip]) branchLabelsByCommit[tip] = [];
        branchLabelsByCommit[tip].push(branchName);
      }
    });

    if (repoState.HEAD) {
      // Find the commit HEAD points to. HEAD could be a branch name or commit hash.
      let headCommit = repoState.currentCommit;
      if (!branchLabelsByCommit[headCommit]) branchLabelsByCommit[headCommit] = [];
      branchLabelsByCommit[headCommit].push('HEAD');
    }

    commitList.forEach((commit, i) => {
      positionMap[commit.id] = { x: xPos, y: currentY };
      currentY += 80;

      let label = `${commit.id.substring(0, 7)}: ${commit.message}`;
      const badges = branchLabelsByCommit[commit.id] || [];
      const badgeStr = badges.length > 0 ? `\n[${badges.join(', ')}]` : '';

      nodes.push({
        id: commit.id,
        position: positionMap[commit.id],
        data: { label: label + badgeStr },
        style: {
          background: repoState.currentCommit === commit.id ? '#3b82f6' : '#1e293b',
          color: 'white',
          border: '1px solid #475569',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '12px',
        }
      });

      if (commit.parent) {
        edges.push({
          id: `${commit.id}-${commit.parent}`,
          source: commit.id,
          target: commit.parent,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#64748b', strokeWidth: 2 },
        });
      }
      // Handle multiple parents (merges)
      if (commit.parents && commit.parents.length > 1) {
        commit.parents.slice(1).forEach(parent => {
          edges.push({
            id: `${commit.id}-${parent}`,
            source: commit.id,
            target: parent,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#64748b', strokeWidth: 2 },
          });
        });
      }
    });

    return { nodes, edges };
  }, [repoState]);

  return (
    <div className="absolute inset-0 bg-background/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#334155" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
