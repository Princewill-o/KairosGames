using NUnit.Framework;
namespace Kairos.Tests {
 public class KairosRulesTests {
  [Test] public void PairsAwardOnlyOnSecondAnimal() {
   var p=new Adventurer();
   Rules.Collect(p,2); Assert.AreEqual(10,p.score);
   Rules.Collect(p,2); Assert.AreEqual(45,p.score);
   Rules.Collect(p,2); Assert.AreEqual(55,p.score);
  }
  [Test] public void InvalidAnimalCannotAwardPoints() {
   var p=new Adventurer(); Rules.Collect(p,-1); Rules.Collect(p,8);
   Assert.AreEqual(0,p.score);
  }
  [Test] public void MovementCannotEscapeArena() {
   var p=new Adventurer {x=899,y=479}; Rules.Move(p,1,1,1);
   Assert.LessOrEqual(p.x,870); Assert.LessOrEqual(p.y,450);
  }
  [Test] public void NonFiniteInputDoesNotPoisonPosition() {
   var p=new Adventurer {x=100,y=100}; Rules.Move(p,float.NaN,float.PositiveInfinity,.1f);
   Assert.AreEqual(100,p.x); Assert.AreEqual(100,p.y);
  }
  [Test] public void FishingRequiresCastAndBiteBeforeReeling() {
   var p=new Adventurer(); Rules.Fish(p,true,.1f);
   Assert.AreEqual(1,p.fishingPhase); Assert.AreEqual(0,p.score);
   Rules.Fish(p,false,.1f); Assert.AreEqual(2,p.fishingPhase);
   Rules.Fish(p,true,.1f); Assert.AreEqual(0,p.score);
  }
 }
}
