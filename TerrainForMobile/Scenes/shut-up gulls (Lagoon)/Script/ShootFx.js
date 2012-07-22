	var  muzzleFlash :Renderer; 
	var  m_LastFrameShot :int= -1;
	
	function LateUpdate()

	{
		
		if (m_LastFrameShot == Time.frameCount)
		{
			
			muzzleFlash.enabled = true;
		
	
		}
	
		else
		{
			muzzleFlash.enabled = false;
			enabled = false;
		}
	}