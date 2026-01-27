import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// GET /api/community/posts
export const getPosts = async (req: Request, res: Response) => {
    const { category, mode } = req.query; // mode = 'PUBLIC' or 'ANONYMOUS'

    try {
        let query = supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        // Filter by Category (if not 'All')
        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

        // Filter by Mode
        if (mode === 'ANONYMOUS') {
            query = query.eq('is_anonymous', true);
        } else {
            // Public mode: Show non-anonymous posts
            // (Or maybe show all in public? Usually public means identifiable)
            // Let's assume Public Chat shows identifiable posts, Anonymous shows anon posts.
            query = query.eq('is_anonymous', false);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase Fetch Error:', error);
            throw error;
        }

        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
    }
};

const BAD_WORDS = ['badword', 'abuse', 'hate', 'stupid', 'idiot']; // Add real list as needed

const filterBadWords = (text: string) => {
    const regex = new RegExp(`\\b(${BAD_WORDS.join('|')})\\b`, 'gi');
    return text.replace(regex, '****');
};

// POST /api/community/posts
export const createPost = async (req: Request, res: Response) => {
    const { user_id, content, category, is_anonymous } = req.body;

    if (!content || !user_id) {
        res.status(400).json({ error: 'Content and User ID are required' });
        return;
    }

    // Filter Content
    const cleanContent = filterBadWords(content);

    try {
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    user_id,
                    content: cleanContent,
                    category,
                    is_anonymous: is_anonymous || false,
                    likes: 0
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (err: any) {
        res.status(500).json({ error: 'Failed to created post', details: err.message });
    }
};
