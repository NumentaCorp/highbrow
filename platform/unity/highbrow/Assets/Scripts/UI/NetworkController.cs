using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Numenta.UI
{
    public class NetworkController : MonoBehaviour
    {
        public float speed = 0.01f;
        public float rotationSpeed = 1f;
        Vector3 _startPos;
        Quaternion _startRot;

        void Start()
        {
            _startPos = transform.position;
			_startRot = transform.rotation;
		}
        // Update is called once per frame
        void Update()
        {
            Vector3 movement = new Vector3();
            Vector3 rotation = new Vector3();
            if (Input.GetKey(KeyCode.R))
            {
                transform.position = _startPos;
                transform.rotation = _startRot;
            }
            else
            {
                float x = Input.GetAxis("Camera X");
                float y = Input.GetAxis("Camera Y");
                float z = Input.GetAxis("Camera Z");
                float yaw = Input.GetAxis("Camera Yaw");
                float pitch = Input.GetAxis("Camera Pitch");
                float roll = Input.GetAxis("Camera Roll");

                movement.x = speed * x;
                movement.y = speed * y;
                movement.z = speed * z;

                rotation.x = roll * rotationSpeed;
                rotation.y = pitch * rotationSpeed;
                rotation.z = yaw * rotationSpeed;
                transform.Rotate(rotation);
                transform.Translate(movement);

            }
        }
    }
}
