using System.Runtime.InteropServices;
using UnityEngine;
namespace Kairos {
 public static class KairosWebBridge {
  [System.Serializable] class Result {public string type="kairos:complete",gameId;public int score;public bool completed=true;}
  #if UNITY_WEBGL && !UNITY_EDITOR
  [DllImport("__Internal")] static extern void KairosResult(string json);
  #endif
  public static void Complete(string gameId,int score){
   #if UNITY_WEBGL && !UNITY_EDITOR
   KairosResult(JsonUtility.ToJson(new Result{gameId=gameId,score=score}));
   #endif
  }
 }
}
