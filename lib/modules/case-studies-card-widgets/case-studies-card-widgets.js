exports.exports = {
	extend: 'apostrophe-widgets',
	label: 'Case Studies Card',
	addFields: [
		{
			name: 'caseStudies',
			label: 'Case Studies Cards',
			limit: 3,
			type: 'array',
			schema: [
				{
					name: 'title',
					label: 'Title',
					type: 'string',
					required: true
				},
				{
					name: 'image',
					label: 'Image',
					type: 'singleton',
					widgetType: 'apostrophe-images',
					options: {
						aspectRatio: [ 16, 9 ],
						minSize: [ 800, 450 ],
						limit: 1
					},
					required: true
				},
				{
					name: 'content',
					label: 'Content',
					type: 'singleton',
					widgetType: 'apostrophe-rich-text',
					options: {
						toolbar: ['Bold', 'Italic', 'Link', 'Unlink']
					},
					required: true
				},
			],
			required: true
		},
	]
};
