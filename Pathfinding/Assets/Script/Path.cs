﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
// Smooth line path
public class Path 
{
    public readonly Vector3[] lookPoints;
    public readonly Line[] turnBoundaries;
    public readonly int finishLineIndex;

    public Path(Vector3[] waypoints, Vector3 startPos, float turnDst)
    {
        lookPoints = waypoints;
        turnBoundaries = new Line[lookPoints.Length];
        finishLineIndex = turnBoundaries.Length -1;

        Vector2 previousPoint = V3ToV2(startPos);
        for(int i = 0; i < lookPoints.Length; i++){
            Vector2 currentPoint = V3ToV2(lookPoints[i]);
            Vector2 dirToCurrentPoint = (currentPoint - previousPoint).normalized;
            Vector2 turnBoundaryPoint = (i == finishLineIndex) ? currentPoint : currentPoint - dirToCurrentPoint * turnDst;
            turnBoundaries[i] = new Line(turnBoundaryPoint, previousPoint - dirToCurrentPoint * turnDst);
            previousPoint = turnBoundaryPoint;
        }
    }
    public Vector3 GetLastPoint(){
        return lookPoints[finishLineIndex];
    }

    Vector2 V3ToV2(Vector3 v3) {
        return new Vector2(v3.x, v3.z);
    }
#if UNITY_EDITOR
    public void DrawWithGizmos() {
        Gizmos.color = Color.black;
        foreach (Vector3 p in lookPoints)
        {
            Gizmos.DrawCube(p + Vector3.up, Vector3.one);
        }
        Gizmos.color = Color.white;
        foreach (Line l in turnBoundaries)
        {
            l.DrawWithGizmos(10);
        }
    }
#endif
}

public struct Line
{
    const float vertialLineGradient = 1e5f;

    float gradient;
    float y_intercept;
    Vector2 pointOnLine_1;
    Vector2 pointOnLine_2;

    float gradientPerpendicular;
    bool approachSide;

    public Line(Vector2 pointOnLine, Vector2 pointPerpendicularToLine){
        float dx = pointOnLine.x - pointPerpendicularToLine.x;
        float dy = pointOnLine.y - pointPerpendicularToLine.y;

        if(dx == 0) {
            gradientPerpendicular = vertialLineGradient;
        } else
            gradientPerpendicular = dy/dx;

        if(gradientPerpendicular == 0) {
            gradient = vertialLineGradient;
        } else
            gradient = -1/gradientPerpendicular;

        y_intercept = pointOnLine.y - gradient * pointOnLine.x;
        pointOnLine_1 = pointOnLine;
        pointOnLine_2 = pointOnLine + new Vector2(1, gradient);

        approachSide = false;
        approachSide = GetSide(pointPerpendicularToLine);
    }

    bool GetSide(Vector2 p)
    {
        return (p.x-pointOnLine_1.x) * (pointOnLine_2.y-pointOnLine_1.y) > (p.y-pointOnLine_1.y) * (pointOnLine_2.x-pointOnLine_1.x);
    }

    public bool HasCrossedLine(Vector2 p) 
    {
        return GetSide(p) != approachSide;
    }
    
#if UNITY_EDITOR
    public void DrawWithGizmos(float length) {
        Vector3 lineDir = new Vector3(1, 0, gradient).normalized;
        Vector3 lineCenter = new Vector3(pointOnLine_1.x, 0, pointOnLine_1.y) + Vector3.up;
        Gizmos.DrawLine(lineCenter - lineDir * length / 2f, lineCenter + lineDir * length / 2f);
    }
#endif
}