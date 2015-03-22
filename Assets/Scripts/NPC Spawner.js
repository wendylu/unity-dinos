#pragma strict
import System.Collections.Generic;

var numberOfEnemies : int = 10;
var npcPrefabs : List.<GameObject>;


function Start () {
	if (npcPrefabs.Count <= 0) return;
	
	var boxCollider : BoxCollider = GetComponent(BoxCollider);
	var min : Vector3 = boxCollider.bounds.min;
	var max : Vector3 = boxCollider.bounds.max;

	Debug.Log(boxCollider);
	for(var i=0; i<numberOfEnemies; i++) {
		var pos : Vector3 = new Vector3(Random.Range(min.x, max.x),
		    Random.Range(min.y, max.y),
		    Random.Range(min.z, max.z));
		var idx : int = Random.Range(0, npcPrefabs.Count);
		var go : GameObject = npcPrefabs[idx];
		Instantiate(go, pos, Quaternion.identity);
	}
}
