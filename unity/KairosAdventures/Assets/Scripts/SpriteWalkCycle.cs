using UnityEngine;
namespace Kairos {
 [RequireComponent(typeof(SpriteRenderer))]
 public sealed class SpriteWalkCycle : MonoBehaviour {
  public Texture2D atlas;
  [Range(0,3)] public int character;
  public bool moving, reducedMotion;
  public Vector2 direction;
  Sprite[] frames;
  SpriteRenderer target;
  void Awake() { target=GetComponent<SpriteRenderer>(); }
  void Start() {
   if(!atlas) return;
   frames=new Sprite[4];float w=atlas.width/4f,h=atlas.height/4f;
   for(int i=0;i<4;i++) frames[i]=Sprite.Create(atlas,new Rect(i*w,(3-character)*h,w,h),new Vector2(.5f,.1f),100);
  }
  void Update() {
   if(frames==null) return;
   target.sprite=frames[moving&&!reducedMotion?Mathf.FloorToInt(Time.time/.13f)%4:0];
   if(direction.x!=0) target.flipX=direction.x<0;
  }
  void OnDestroy(){if(frames!=null)foreach(var frame in frames)Destroy(frame);}
 }
}
