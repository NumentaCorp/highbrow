// Numenta Platform for Intelligent Computing (NuPIC)
// Copyright (C)  2017, Numenta, Inc.  Unless you have an agreement
// with Numenta, Inc., for a separate license for this software code, the
// following terms and conditions apply:
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero Public License version 3 as
// published by the Free Software Foundation.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU Affero Public License for more details.
// You should have received a copy of the GNU Affero Public License
// along with this program.  If not, see http://www.gnu.org/licenses.
// http://numenta.org/licenses/
using UnityEngine;

namespace Numenta.Renderable
{
    /// <summary>
    /// This class represents a single neuron
    /// </summary>
    public class Neuron : MonoBehaviour
    {
        public enum CellType
        {
            Pyramidal,
            Stellate,
            Basket
        }

        public enum State
        {
            Inactive,
            Active,
            Depolarized
        }

        [Tooltip("Material associated with the 'Active' state")]
        public Material activeColor;
        [Tooltip("Material associated with the 'Inactive' state")]
        public Material inactiveColor;
		[Tooltip("Material associated with the 'Depolarized' state")]
		public Material depolarizedColor;
		[Tooltip("Material associated with the 'Bursted' minicolumn")]
		public Material burstedColor;
		[Tooltip("Cell Type")]
        public CellType cerllType;
        [Tooltip("Current neuron state")]
        public State state = State.Inactive;

        State _oldState = State.Inactive;
        MiniColumn _minicolumn;
        bool _bursted = false;

        Vector3 _startScale;
        void Start()
        {
			_minicolumn = GetComponentInParent<MiniColumn>();
			_startScale = transform.localScale;
        }
        void Update()
        {
            var rend = GetComponent<Renderer>();
            // Special case for bursted minicolumn
            if (_minicolumn != null && _minicolumn.state == MiniColumn.State.Active)
            {
                rend.sharedMaterial = burstedColor;
                transform.localScale = _startScale / 2;
                _bursted = true;
            }
            else if (state != _oldState || _bursted)
            {
                _bursted = false;
                transform.localScale = _startScale;
                switch (state)
                {
                    case State.Active:
                        rend.sharedMaterial = activeColor;
                        break;
                    case State.Depolarized:
                        rend.sharedMaterial = depolarizedColor;
                        break;
                    case State.Inactive:
                        rend.sharedMaterial = inactiveColor;
                        break;
                    default:
                        rend.sharedMaterial = inactiveColor;
                        break;
                }
                _oldState = state;
            }
        }
    }
}
