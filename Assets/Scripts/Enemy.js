#pragma strict
 
/// <summary>
/// Creates wandering behaviour for a CharacterController.
/// </summary>
@script RequireComponent(CharacterController)
 
    var speed:float = 4;
    var directionChangeInterval:float = 1;
    var maxHeadingChange:float = 90;
 
    var heading: float=0;
    var targetRotation: Vector3 ;
 
    enum State {
      Running,
      Idle
    };
    
    private var state: State = State.Running;
    
    var zombieAnimation : AnimationClip;
    var happyAnimation : AnimationClip;
    
    var zombieParticles : GameObject;
    var happyParticles : GameObject;
    var happyTransitionParticles : GameObject;
    
    var zombieMaterial : Material;
    var happyMaterial : Material;
    
    private var _activeParticles : GameObject;
    
    private var _animation : Animation;

    function Awake (){
 
        // Set random initial rotation
		transform.eulerAngles = Vector3(0, Random.Range(0,360), 0);  // look in a random direction at start of frame.
 
		_animation = GetComponent(Animation);
		if(!_animation)
			Debug.Log("The character you would like to control doesn't have animations. Moving her might look weird.");
	
		if (zombieAnimation)
	 		_animation.CrossFade(zombieAnimation.name);

		if (zombieParticles) {
			_activeParticles = Instantiate(zombieParticles, Vector3.zero, Quaternion.identity);
			_activeParticles.transform.parent = transform;
			_activeParticles.transform.localPosition = Vector3.zero;
		}
		
		if (zombieMaterial) {
			transform.Find("skin").renderer.material = zombieMaterial;
		}
		
		NewHeadingRoutine ();
    }
 
    function Update (){
		var controller : CharacterController = GetComponent(CharacterController);
 
 		if (state == State.Running) {
        	transform.eulerAngles = Vector3.Slerp(transform.eulerAngles, targetRotation, Time.deltaTime * directionChangeInterval);
        	var forward = transform.TransformDirection(Vector3.forward);
        	controller.SimpleMove(forward * speed);
        }
    }
 
    /// <summary>
    /// Repeatedly calculates a new direction to move towards.
    /// Use this instead of MonoBehaviour.InvokeRepeating so that the interval can be changed at runtime.
    /// </summary>
	while (state == State.Running){
		NewHeadingRoutine();
		yield WaitForSeconds(directionChangeInterval);
	}
 
    function OnPlayerHitMe() {
    	if (state != State.Running) return;
    	
    	// Enemy was hit.  Go into happy mode.
    	
    	// Go to idle state
        state = State.Idle;
        
        // Set animation
        if (happyAnimation) {
	 		_animation.CrossFade(happyAnimation.name);
	 	}
	 	
	 	// Set particles to happy particles
	 	if (_activeParticles) {
	 		Destroy(_activeParticles);
	 		_activeParticles = null;
	 	}
	 	if (happyParticles) {
	 		_activeParticles = Instantiate(happyParticles, Vector3.zero, Quaternion.identity);
			_activeParticles.transform.parent = transform;
			_activeParticles.transform.localPosition = Vector3.zero;
		}
		
	 	if (happyTransitionParticles) {
	 		var transitionParticles = Instantiate(happyTransitionParticles, Vector3.zero, Quaternion.identity);
			transitionParticles.transform.parent = transform;
			transitionParticles.transform.localPosition = Vector3.zero;
			//Destroy(transitionParticles);
		}
		
		// Set material to happy material
		if (happyMaterial) {
			transform.Find("skin").renderer.material = happyMaterial;
		}
    }
    
    /// <summary>
    /// Calculates a new direction to move towards.
    /// </summary>
    function NewHeadingRoutine (){
        var floor = Mathf.Clamp(heading - maxHeadingChange, 0, 360);
        var ceil  = Mathf.Clamp(heading + maxHeadingChange, 0, 360);
        heading = Random.Range(floor, ceil);
        targetRotation = new Vector3(0, heading, 0);
    }