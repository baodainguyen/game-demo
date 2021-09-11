using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Threading;

public class PathRequestManager : MonoBehaviour
{
    Queue<PathResult> results = new Queue<PathResult>();
    
    [SerializeField]
    List<Node> lastNodesUsed = new List<Node>();
    public void AddNodeUsed(Node node) {
        if(!lastNodesUsed.Contains(node)){
            lastNodesUsed.Add(node);
        }
    }
    public void RemoveNodeUsed(Vector3 pos) {
        int idx = lastNodesUsed.FindLastIndex((Node n) => {
            return (pos - n.worldPosition).sqrMagnitude < .003f;
        });
        if(idx > -1 && idx < lastNodesUsed.Count)
            lastNodesUsed.RemoveAt(idx);
    }
    public bool IsUsed(Node node) {
        int idx = lastNodesUsed.FindLastIndex((Node n) => {
            return n.gridX == node.gridX && n.gridY == node.gridY;
        });
        return idx > -1 && idx < lastNodesUsed.Count;
    }
    
    public static PathRequestManager instance;
    Pathfinding pathfinding;
    public PathNode GetLastAvailable(PathNode path, Vector3 targetPos) {
        Vector3[] waypoints = path.waypoints;
        Node lastNode = path.lastNode;
        if(IsUsed(lastNode)) {
            Node newNode = pathfinding.GetArroundAvailable(targetPos, lastNode);
            Vector3 newPos = newNode.worldPosition;
            path.UpdateLastPoint(newPos);
            path.lastNode = newNode;
        }
        return path;
    }
    
    public Vector3 GetLastAvailable(Node node, Vector3 targetPos) {
        if(IsUsed(node)) {
            return pathfinding.GetArroundAvailable(targetPos, node).worldPosition;
        };
        return Vector3.zero;
    }

    void Awake(){
        instance = this;
        pathfinding = GetComponent<Pathfinding>();
    }
    void Update(){
        if(results.Count > 0) {
            int itemsInQueue = results.Count;
            lock(results){
                for(int i =0; i < itemsInQueue; i++) {
                    PathResult result = results.Dequeue();
                    result.callback(result.path, result.success);
                }
            }
        }
    }
    public static void RequestPath(PathRequest request)
    {
        ThreadStart threadStart = delegate {
            instance.pathfinding.FindPath(request, instance.FinishedProcessingPath);
        };
        threadStart.Invoke();
    }
    public void FinishedProcessingPath(PathResult result)
    {
        lock(results) {
            results.Enqueue(result);
        }
    }
        
}
public struct PathResult
    {
        public PathNode path;
        public bool success;
        public Action<PathNode, bool> callback;
        public PathResult(PathNode nodes, bool success, 
            Action<PathNode, bool> _cb)
        {
            path = nodes; this.success = success; callback = _cb;
        }
    }
public struct  PathRequest
    {
        public Vector3 pathStart;
        public Vector3 pathEnd;
        public Action<PathNode, bool> callback;
        public PathRequest(Vector3 _start, Vector3 _end, Action<PathNode, bool> _cb)
        {
            pathStart = _start; pathEnd = _end; callback = _cb;
        }
    }
public struct PathNode
{
    public Vector3[] waypoints;
    public Node lastNode;
    public PathNode (Vector3[] path, Node node) {
        waypoints = path; lastNode = node;
    }
    public void UpdateLastPoint(Vector3 point){
        if(waypoints.Length > 0) {
            waypoints[waypoints.Length -1] = point;
        }
    }
}
