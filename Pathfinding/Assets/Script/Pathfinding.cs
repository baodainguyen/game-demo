using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Diagnostics;
using System;

public class Pathfinding : MonoBehaviour
{
    PGrid grid;
    public Node GetArroundAvailable(Vector3 target, Node n) { 
        return grid.GetArroundAvailable(target, n); 
    }

    void Awake(){
        grid = GetComponent<PGrid>();
    }
    
    public void FindPath(PathRequest request, Action<PathResult> callback) {
        Stopwatch sw = new Stopwatch();
        sw.Start();

        bool pathSuccess = false;
        Node startNode = grid.NodeFromWorldPoint(request.pathStart);
        Node targetNode = grid.NodeFromWorldPoint(request.pathEnd);

        if(startNode.walkable && targetNode.walkable){
            Heap<Node> openSet = new Heap<Node>(grid.MaxSize);
            HashSet<Node> closedSet = new HashSet<Node>();
            openSet.Add(startNode);

            while(openSet.Count > 0) {
                Node currentNode = openSet.RemoveFirst();

                closedSet.Add(currentNode);

                if(currentNode == targetNode) {
                    sw.Stop();
                    print("Path found: " + sw.ElapsedMilliseconds + " ms");

                    pathSuccess = true;
                    break;
                }
                foreach(Node neighbour in grid.GetNeighbours(currentNode))
                {
                    if(!neighbour.walkable || closedSet.Contains(neighbour))
                        continue;

                    int newMovementCostToNeighbour = GetMoveCost2Neighbour(currentNode,neighbour);
                    if(newMovementCostToNeighbour < neighbour.gCost || !openSet.Contains(neighbour))
                    {
                        neighbour.gCost = newMovementCostToNeighbour;
                        neighbour.hCost = GetDistance(neighbour, targetNode);
                        neighbour.parent = currentNode;

                        if(!openSet.Contains(neighbour))
                            openSet.Add(neighbour);
                        else 
                            openSet.UpdateItem(neighbour);
                    }
                }
            }
        }
        
        if(pathSuccess) {            
            PathNode pathNodes = GetPathNode(startNode, targetNode);
            pathSuccess = pathNodes.waypoints.Length > 0;
            callback(new PathResult(pathNodes, pathSuccess, request.callback));
        }
    }
    int GetMoveCost2Neighbour(Node currentNode, Node neighbour){
        return currentNode.gCost + GetDistance(currentNode, neighbour) + neighbour.movementPenalty;
    }
    PathNode GetPathNode(Node startNode, Node endNode) {
        Vector3[] waypoints = new Vector3[0];
        var pathNode = RetracePath(startNode, endNode);
        waypoints = SimplifyPath(pathNode);

        Array.Reverse(waypoints);
        return new PathNode (waypoints, pathNode.Count > 1 ? pathNode[1] : null);
    }
    
    List<Node> RetracePath(Node startNode, Node endNode){
        List<Node> path = new List<Node>();
        Node currentNode = endNode;
       
        while(currentNode != startNode) {
            path.Add(currentNode);
            currentNode = currentNode.parent;
        }
        return path;
    }

    Vector3[] SimplifyPath(List<Node> path)
    {
        List<Vector3> waypoints = new List<Vector3>();
        Vector2 directionOld = Vector2.zero;
        
        for(int i = 1; i < path.Count; i++)
        {
            Node nFoward = path[i-1];
            Node n = path[i];
            Vector2 directionNew = new Vector2(nFoward.gridX - n.gridX,nFoward.gridY - n.gridY);
            if(directionNew != directionOld)
            {
                waypoints.Add(n.worldPosition);
            }
            directionOld = directionNew;
        }
        return waypoints.ToArray();
    }
    
    int GetDistance(Node nodeA, Node nodeB) {
        int dstX = Mathf.Abs(nodeA.gridX - nodeB.gridX);
        int dstY = Mathf.Abs(nodeA.gridY - nodeB.gridY);

        if(dstX > dstY){
            return 14*dstY + 10*(dstX - dstY);
        }
        return 14*dstX + 10*(dstY - dstX);
    }

}
