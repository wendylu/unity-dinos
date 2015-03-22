#pragma strict

var jumpSound : AudioClip;
@script RequireComponent(AudioSource)

function DidJump() {
	AudioSource.PlayClipAtPoint(jumpSound, transform.position);
}