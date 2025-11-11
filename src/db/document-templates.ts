/**
 * Returns the template content for a document based on its name and project type
 */
export const getDocumentTemplate = (
    docName: string,
    projectType: string
): object => {
    const type = projectType.toLowerCase();

    // Default empty content
    const emptyContent = {
        type: 'doc',
        content: [{ type: 'paragraph' }],
    };

    // Novel templates
    if (type === 'novel') {
        if (docName === 'Title page') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1, textAlign: 'center' },
                        content: [
                            {
                                type: 'text',
                                text: '[Title]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    { type: 'paragraph' },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'center' },
                        content: [{ type: 'text', text: 'by' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 3, textAlign: 'center' },
                        content: [{ type: 'text', text: '[Author Name]' }],
                    },
                    { type: 'paragraph' },
                    { type: 'paragraph' },
                    { type: 'paragraph' },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'center' },
                        content: [{ type: 'text', text: '[Contact Information]' }],
                    },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'center' },
                        content: [{ type: 'text', text: '[Email]' }],
                    },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'center' },
                        content: [{ type: 'text', text: '[Phone]' }],
                    },
                ],
            };
        }
        if (docName === 'Synopsis') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Synopsis' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Genre: [Genre]' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Word Count: [Approximate word count]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Brief summary of your novel - typically 1-2 paragraphs covering the main conflict, characters, and resolution]',
                            },
                        ],
                    },
                ],
            };
        }
        if (docName === 'Characters') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Main Characters' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Character Name]',
                                marks: [{ type: 'bold' }],
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '- Role: [Protagonist/Antagonist/etc.]',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Age:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: '- Physical Description:' },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Personality:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Motivation:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Character Arc:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Backstory:' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '---' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: '[Add more characters as needed]' },
                        ],
                    },
                ],
            };
        }
        if (docName === 'World building') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'World Building' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Setting' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Time Period:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Location:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Climate/Geography:' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Society & Culture' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Government:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Social Structure:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: '- Customs & Traditions:' },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Religion/Beliefs:' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Rules of the World' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '- Magic System (if applicable):',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Technology Level:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Unique Elements:' }],
                    },
                ],
            };
        }
        if (docName === 'Plot outline') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Plot Outline' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Act 1 - Setup' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Inciting Incident:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- First Plot Point:' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [
                            { type: 'text', text: 'Act 2 - Confrontation' },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Midpoint:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Second Plot Point:' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Act 3 - Resolution' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Climax:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Resolution:' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Key Scenes:' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '1.' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '2.' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '3.' }],
                    },
                ],
            };
        }
    }

    // Screenplay templates
    if (type === 'screenplay') {
        if (docName === 'Title page') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1, textAlign: 'center' },
                        content: [{ type: 'text', text: '[TITLE]' }],
                    },
                    { type: 'paragraph' },
                    { type: 'paragraph' },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'center' },
                        content: [{ type: 'text', text: 'Written by' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 3, textAlign: 'center' },
                        content: [{ type: 'text', text: '[Author Name]' }],
                    },
                    { type: 'paragraph' },
                    { type: 'paragraph' },
                    { type: 'paragraph' },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'center' },
                        content: [{ type: 'text', text: '[Contact Information]' }],
                    },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'center' },
                        content: [{ type: 'text', text: '[Email]' }],
                    },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'center' },
                        content: [{ type: 'text', text: '[Phone]' }],
                    },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'center' },
                        content: [
                            {
                                type: 'text',
                                text: '[Agent/Manager if applicable]',
                            },
                        ],
                    },
                ],
            };
        }
        if (docName === 'Logline') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Logline' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[One sentence pitch that describes the protagonist, their goal, the antagonist, and the stakes]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Example: "A determined marine biologist must overcome her fear of the ocean to stop a genetically modified shark before it destroys a coastal town."',
                                marks: [{ type: 'italic' }],
                            },
                        ],
                    },
                ],
            };
        }
        if (docName === 'Treatment') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Treatment' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Title: [Title]' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Genre: [Genre]' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Format: [Feature/TV Pilot/Short]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Logline' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '[Your logline here]' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Synopsis' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[2-3 paragraph summary of the story]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Character Breakdown' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '- [Main Character]: [Brief description]',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '- [Supporting Character]: [Brief description]',
                            },
                        ],
                    },
                ],
            };
        }
        if (docName === 'Characters') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Character Profiles' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[CHARACTER NAME]',
                                marks: [{ type: 'bold' }],
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Age: [Age]' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: 'Occupation: [Occupation]' },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Description: [Physical and personality description]',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: 'Want: [External goal]' },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Need: [Internal/emotional need]',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Flaw: [Fatal flaw or weakness]',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: 'Arc: [How they change]' },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '---' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: '[Add more characters]' },
                        ],
                    },
                ],
            };
        }
        if (docName === 'Scene breakdown') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Scene Breakdown' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Scene 1 - INT./EXT. [LOCATION] - DAY/NIGHT',
                                marks: [{ type: 'bold' }],
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Brief description of what happens',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Scene 2 - INT./EXT. [LOCATION] - DAY/NIGHT',
                                marks: [{ type: 'bold' }],
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Brief description of what happens',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '[Continue...]' }],
                    },
                ],
            };
        }
    }

    // Article templates
    if (type === 'article') {
        if (docName === 'Title') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: '[Your Article Title Here]' },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Subtitle: [Optional subtitle that expands on the title]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'By [Author Name]' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '[Date]' }],
                    },
                ],
            };
        }
        if (docName === 'Abstract') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Abstract' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[150-250 word summary of your article covering:',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '- The main topic/research question',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: '- Key findings or arguments' },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '- Methodology (if applicable)',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: '- Conclusions/implications]' },
                        ],
                    },
                ],
            };
        }
        if (docName === 'Introduction') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Introduction' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Hook - Start with an interesting fact, question, or anecdote]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Context - Provide background information on the topic]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Thesis - State your main argument or the purpose of the article]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Overview - Brief outline of what the article will cover]',
                            },
                        ],
                    },
                ],
            };
        }
        if (docName === 'Body') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: '[Section 1 Heading]' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '[Main point/argument]' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: '- Supporting evidence' },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Examples' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Analysis' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: '[Section 2 Heading]' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '[Main point/argument]' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: '- Supporting evidence' },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Examples' }],
                    },
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '- Analysis' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Continue with additional sections as needed]',
                            },
                        ],
                    },
                ],
            };
        }
        if (docName === 'Conclusion') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Conclusion' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: '[Summarize key points]' },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Restate thesis/main findings]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Implications or call to action]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Future directions or questions]',
                            },
                        ],
                    },
                ],
            };
        }
        if (docName === 'References') {
            return {
                type: 'doc',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'References' }],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[Author Last Name, First Initial. (Year). Title. Publisher/Journal. URL]',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Example:',
                                marks: [{ type: 'bold' }],
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Smith, J. (2024). The Art of Writing. Writing Press. https://example.com',
                            },
                        ],
                    },
                    { type: 'paragraph' },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '[List all sources cited in your article]',
                            },
                        ],
                    },
                ],
            };
        }
    }

    return emptyContent;
};
