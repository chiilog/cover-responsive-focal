/**
 * Cover Responsive Focal - Block Save Extension
 * Extends the core/cover block save functionality to add data-fp-id attribute
 */

import { addFilter } from '@wordpress/hooks';
import { cloneElement } from '@wordpress/element';
import type { ReactNode, ReactElement } from 'react';
import type { CoverBlockAttributes } from './types';

// Interface for block type
interface BlockType {
	name?: string;
}

/**
 * Filter function to extend cover block save processing
 * Adds data-fp-id attribute when responsiveFocal is not empty
 *
 * @param element    - Original save element
 * @param blockType  - Block type object
 * @param attributes - Block attributes
 * @return Modified save element or original element
 */
const extendCoverBlockSave = (
	element: ReactNode,
	blockType: BlockType | null | undefined,
	attributes: CoverBlockAttributes | null | undefined
): ReactNode => {
	// Only process core/cover blocks
	if ( ! blockType || blockType.name !== 'core/cover' ) {
		return element;
	}

	// Handle null/undefined attributes
	if ( ! attributes ) {
		return element;
	}

	const { responsiveFocal, dataFpId } = attributes;

	// Return original element if responsiveFocal is empty or invalid
	if (
		! responsiveFocal ||
		! Array.isArray( responsiveFocal ) ||
		responsiveFocal.length === 0
	) {
		return element;
	}

	// Generate or use existing dataFpId
	// Using WordPress-style unique ID generation similar to instance IDs
	const fpId =
		dataFpId ||
		`crf-${ Date.now() }-${ Math.floor( Math.random() * 10000 ) }`;

	// Type guard to check if element is a React element with props
	const isReactElement = ( el: ReactNode ): el is ReactElement => {
		return el !== null && typeof el === 'object' && 'props' in el;
	};

	// Return original element if it's not a React element
	if ( ! isReactElement( element ) ) {
		return element;
	}

	// Clone element with additional data-fp-id attribute
	// This preserves all existing props and adds the new attribute
	return cloneElement( element, {
		...element.props,
		'data-fp-id': fpId,
	} );
};

// Register the filter hook
addFilter( 'blocks.getSaveElement', 'crf/extend-save', extendCoverBlockSave );

// Export for testing
export { extendCoverBlockSave };
