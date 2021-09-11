using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Unit : MonoBehaviour
{
    const float pathUpdateModeThreshol = .5f;
    const float minPathUpdateTime = .2f;
    public Transform target;

    [Range(3f, 30f)]
    public float speed = 3;
    public float turnSpeed = 9;
    public float turnDst = 1;
    Path path;

    void Start(){
        StartCoroutine(UpdatePath());
    }

    public void OnPathFound(PathNode pathNodes, bool pathSuccessful)
    {
        if(pathSuccessful)
        {
            PathNode verifyPath = PathRequestManager.instance.GetLastAvailable(pathNodes, target.position);

            path = new Path(verifyPath.waypoints, transform.position, turnDst);
            
            PathRequestManager.instance.AddNodeUsed(verifyPath.lastNode);
            StopCoroutine(nameof(FollowPath));
            StartCoroutine(nameof(FollowPath));
        }
    }
     
    IEnumerator UpdatePath() {
        if(Time.timeSinceLevelLoad < .3f){
            yield return new WaitForSeconds(.3f);
        }
        
        PathRequestManager.RequestPath(new PathRequest(transform.position, target.position, OnPathFound));

        float sqrMoveThreshold = pathUpdateModeThreshol * pathUpdateModeThreshol;
        Vector3 targetPosOld = target.position;

        while(true)
        {
            yield return new WaitForSeconds(minPathUpdateTime);
            if((target.position - targetPosOld).sqrMagnitude > sqrMoveThreshold) {
                PathRequestManager.RequestPath(new PathRequest(transform.position, target.position, OnPathFound));
                targetPosOld = target.position;
            }
            
        }
    }

    IEnumerator FollowPath() {
        bool fllowingPath = true;
        int pathIndex = 0;
        transform.LookAt(path.lookPoints[0]);

        while(fllowingPath) {
            Vector2 pos2D = new Vector2(transform.position.x, transform.position.z);
            while(path.turnBoundaries[pathIndex].HasCrossedLine(pos2D))
            {
                if(pathIndex == path.finishLineIndex) {
                    fllowingPath = false;
                    PathRequestManager.instance.RemoveNodeUsed(path.GetLastPoint());
                    break;
                } else {
                    pathIndex++;
                }
            }

            if(fllowingPath) {
                Quaternion targetRotation = Quaternion.LookRotation(path.lookPoints[pathIndex] - transform.position);
                transform.rotation = Quaternion.Lerp(transform.rotation, targetRotation, Time.deltaTime * turnSpeed);
                transform.Translate(Vector3.forward * Time.deltaTime * speed, Space.Self);
            }
            yield return null;
        }
    }

    
#if UNITY_EDITOR
    
    public bool displayGridGizmos;
    void OnDrawGizmos(){
        if(path != null) {
            path.DrawWithGizmos();
        }
    }
#endif
}
