import os
import re



def rename_to_mdx(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                new_file_path = os.path.join(root, file.replace('.md', '.mdx'))
                os.rename(file_path, new_file_path)

def update_frontmatter(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.mdx'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    content = f.read()

                pattern = r'^---\n(.*?)\n---\n'
                match = re.search(pattern, content, re.DOTALL)
                if match:
                    frontmatter = match.group(1)

                    new_frontmatter = 'layout: src/layouts/'

                    if '/builds/' in root:
                        new_frontmatter += 'Build' 
                        new_frontmatter = frontmatter + f'\n{new_frontmatter}.astro'

                    elif '/guides/' in root:
                        new_frontmatter += 'Guide'
                        new_frontmatter = frontmatter + f'\n{new_frontmatter}.astro'

                    elif '/fractals/' in root:
                        new_frontmatter = frontmatter

                    new_content = content.replace(frontmatter, new_frontmatter).replace("\"legends\"", "\"skills\":[],\"legends\"")
            
                    with open(file_path, 'w') as f:
                        f.write(new_content)


def update_images(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.mdx'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    content = f.read()

                pattern = r'!\[(.*?)\]\((.*?)\)'
                matches = re.findall(pattern, content)

                for match in matches:
                    original_path = match[1]
                    original_caption = match[0]
                    new_path = f'{os.path.dirname(original_path)}/{os.path.basename(original_path).split(".")[0]}.astro'
                    new_content = f'<Image src={{import("./{original_path}")}} caption="{original_caption}" />'

                    content = content.replace(f'![{original_caption}]({original_path})', new_content)

                    with open(file_path, 'w') as f:
                        f.write(content)

                    if os.path.isfile(original_path):
                        os.rename(original_path, new_path)



if __name__ == '__main__':
    rename_to_mdx('discretize-guides/')
    update_frontmatter('discretize-guides/')
    update_images('discretize-guides/')
