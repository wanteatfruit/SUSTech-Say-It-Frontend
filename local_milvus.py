from pymilvus import (has_collection, connections, FieldSchema,
                      CollectionSchema, DataType, Collection, utility)


def create_schema():
    if has_collection("posts_cohere"):
        print("Collection already exists")
        return Collection(name="posts_cohere")
    fields = [
        FieldSchema(name="id", dtype=DataType.INT64,
                    is_primary=True, auto_id=True),
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=768),
        FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=65535),
        FieldSchema(name="post_id", dtype=DataType.INT64),
        FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=65535),
    ]
    schema = CollectionSchema(fields=fields, description="posts")
    posts = Collection(name="posts_cohere", schema=schema)
    print(posts.name)


def create_index(schema):
    index = {
        "index_type": "IVF_FLAT",
        "metric_type": "L2",
        "params": {"nlist": 128},
    }
    schema.create_index("embedding", index)


if __name__ == "__main__":
    connections.connect("default", host='localhost', port='19530')
    schema = create_schema()

    res = schema.query(
        expr="post_id in [48]",
        offset=0,
        limit=10,
        output_fields=["text"],
        consistency_level="Strong"
    )
    # create_index(schema)
    # print(utility.list_collections())
    print(res)
