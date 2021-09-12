using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PGrid : MonoBehaviour
{
    public LayerMask unwalkableMask;
    public Vector2 gridWorldSize;
    public float nodeRadius;
    Node[,] grid;

    public TerrainType[] walkableRegions;
    [SerializeField]LayerMask walkableMask;
    Dictionary<int, byte> walkableRegionsDictionary = new Dictionary<int, byte>();
    
    float nodeDiameter;
    int gridSizeX, gridSizeY;

    void Awake()
    {
        nodeDiameter = nodeRadius * 2;
        gridSizeX = Mathf.RoundToInt(gridWorldSize.x / nodeDiameter);
        gridSizeY = Mathf.RoundToInt(gridWorldSize.y / nodeDiameter);

        foreach(TerrainType region in walkableRegions) 
        {
            walkableMask.value |= region.terrainMask.value;
            walkableRegionsDictionary.Add((int)Mathf.Log(region.terrainMask.value,2), region.terrainPenalty);
        }

        CreateGrid();
    }

    public int MaxSize
    {
        get { return gridSizeX * gridSizeY; }
    }
    
    void CreateGrid(){
        grid = new Node[gridSizeX, gridSizeY];
        
        for(int x = 0; x < gridSizeX; x++){
            for(int y = 0; y < gridSizeY; y++){
                Vector3 worldPoint = GetWorlPoint(x, y);
                bool walkable = !(Physics.CheckSphere(worldPoint, nodeRadius, unwalkableMask));
                
                byte movementPenalty = 0;
                // raycast
                if(walkable) 
                {
                    Ray ray = new Ray(worldPoint + Vector3.up * 50, Vector3.down);
                    if(Physics.Raycast(ray, out RaycastHit hit, 100, walkableMask)) 
                    {
                        walkableRegionsDictionary.TryGetValue(hit.collider.gameObject.layer, out movementPenalty);
                    }
                }

                grid[x,y] = new Node(walkable,worldPoint, x,y,movementPenalty);
            }
        }
    }
    Vector3 GetWorlPoint(int x, int y) {
        Vector3 worldBottomLeft = transform.position - Vector3.right * gridWorldSize.x/2 - Vector3.forward * gridWorldSize.y/2;
        return worldBottomLeft + Vector3.right * (x * nodeDiameter + nodeRadius) + Vector3.forward * (y * nodeDiameter + nodeRadius);
    }

    public Node GetArroundAvailable(Vector3 target, Node exceptN) {
        Node targetNode = NodeFromWorldPoint(target);
        var arrounds = GetArroundsAvailable(targetNode);
        
        Node newNode = arrounds.Find(n => !n.Is(exceptN) && n.movementPenalty < 3 );
        
        if(newNode == null)
            newNode = arrounds.Find(delegate(Node n) { return !n.Is(exceptN); });
        
        return newNode;
    }
    List<Node> GetArroundsAvailable(Node target) {
        var neighbours = GetNeighbours(target).FindAll(n => n.walkable && !PathRequestManager.instance.IsUsed(n));
        neighbours.Sort((a, b) => b.gCost - a.gCost );
        return neighbours;
    }
    
    public List<Node> GetNeighbours(Node node) {
        List<Node> neighbours = new List<Node>();

        for(int x = -1; x <= 1; x++) {
            for(int y = -1; y <= 1; y++) {
                if(x == 0 && y == 0) {
                    continue;
                }

                int checkX = node.gridX + x;
                int checkY = node.gridY + y;

                if(checkX >= 0 && checkX < gridSizeX && checkY >= 0 && checkY < gridSizeY)
                {
                    neighbours.Add(grid[checkX,checkY]);
                }
            }
        }

        return neighbours;
    }

    public Node NodeFromWorldPoint(Vector3 worldPosition){
        float percentX = (worldPosition.x + gridWorldSize.x/2) / gridWorldSize.x;
        float percentY = (worldPosition.z + gridWorldSize.y/2) / gridWorldSize.y;
        percentX = Mathf.Clamp01(percentX);
        percentY = Mathf.Clamp01(percentY);

        int x = Mathf.RoundToInt((gridSizeX-1) * percentX);
        int y = Mathf.RoundToInt((gridSizeY-1) * percentY);
        return grid[x,y];
    }

    [System.Serializable]
    public class TerrainType {
        public LayerMask terrainMask;
        public byte terrainPenalty;
    }

#if UNITY_EDITOR
    
    public bool displayGridGizmos;
    void OnDrawGizmos(){
        Gizmos.DrawWireCube(transform.position, new Vector3(gridWorldSize.x, 1, gridWorldSize.y));
        if(grid != null && displayGridGizmos)
        {    
            foreach (Node n in grid) {
                Gizmos.color = (n.walkable) ? Color.white : Color.red;
                if(n.movementPenalty > 0)
                    Gizmos.color = Color.cyan;
                Gizmos.DrawCube(n.worldPosition, Vector3.one * (nodeDiameter-.1f));
            }
        }
    }
#endif
}
