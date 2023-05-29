from pymilvus import Collection, connections

connections.connect("default", host='localhost', port='19530')


collection = Collection("posts_cohere")  # Get an existing collection
expr = "id > 0"  # Prepare the boolean expression

deleted_ids = collection.delete(expr)  # Delete the entities and get the ID list
print("Deleted IDs:", deleted_ids)