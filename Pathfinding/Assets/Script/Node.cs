using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class Node : IHeapItem<Node>
{
    public bool walkable;
    public Vector3 worldPosition;
    public int gridX, gridY;

    public byte movementPenalty;
   
    public int gCost;
    public int hCost;

    public Node parent;
    int heapIndex;

    public Node(bool _walkable, Vector3 _wPos, int _gX, int _gY, byte _pel){
        walkable = _walkable;
        worldPosition = _wPos;
        gridX = _gX;
        gridY = _gY;
        movementPenalty = _pel;
    }
    
    public int fCost {
        get {
            return gCost + hCost;
        }
    }
    public bool Is(Node n){
        return n.gridX == gridX && n.gridY == gridY;
    }
    
    public int CompareTo(Node nodeToCompare)
    {
        int compare = fCost.CompareTo(nodeToCompare.fCost);
        if(compare == 0){
            compare = hCost.CompareTo(nodeToCompare.hCost);
        }
        return -compare;
    }

    public int HeapIndex {
        get {
            return heapIndex;
        }
        set {
            heapIndex = value;
        }
    }
}
